const { withGradleProperties, withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo Config Plugin siêu tối ưu hóa dung lượng APK và tốc độ biên dịch Android
 * Tự động áp dụng cho cả EAS Cloud Build (nhánh releases) và GitHub Actions (nhánh main)
 */
const withAndroidOptimizations = (config) => {
  // 1. Tối ưu các cờ hiệu năng và dung lượng trong gradle.properties
  config = withGradleProperties(config, (config) => {
    const properties = [
      // Chỉ biên dịch kiến trúc 64-bit hiện đại (arm64-v8a), giảm 75% file C++ native
      { type: 'property', key: 'reactNativeArchitectures', value: 'arm64-v8a' },
      // Nén toàn bộ thư viện .so native bên trong APK bằng ZIP DEFLATE
      { type: 'property', key: 'expo.useLegacyPackaging', value: 'true' },
      // Tắt bộ giải mã GIF gốc của React Native (app dùng expo-image tối ưu hơn)
      { type: 'property', key: 'expo.gif.enabled', value: 'false' },
      // Kích hoạt dọn dẹp tài nguyên thừa (XML, drawables không dùng)
      { type: 'property', key: 'android.enableShrinkResourcesInReleaseBuilds', value: 'true' },
      // Kích hoạt thu nhỏ mã bytecode (Minify/Obfuscation)
      { type: 'property', key: 'android.enableMinifyInReleaseBuilds', value: 'true' },
      // Kích hoạt R8 Full Mode (chế độ nén và inlining hàm mạnh nhất của Google)
      { type: 'property', key: 'android.enableR8.fullMode', value: 'true' },
      // Nén ảnh PNG qua AAPT2
      { type: 'property', key: 'android.enablePngCrunchInReleaseBuilds', value: 'true' },
      // Tăng tốc biên dịch song song và cấp 4.5GB RAM cho Gradle JVM
      { type: 'property', key: 'org.gradle.parallel', value: 'true' },
      { type: 'property', key: 'org.gradle.caching', value: 'true' },
      { type: 'property', key: 'org.gradle.jvmargs', value: '-Xmx4608m -XX:MaxMetaspaceSize=1024m -XX:+UseParallelGC -Dfile.encoding=UTF-8' },
    ];

    properties.forEach(({ key, value, type }) => {
      const existing = config.modResults.find((item) => item.key === key);
      if (existing) {
        existing.value = value;
      } else {
        config.modResults.push({ type, key, value });
      }
    });

    return config;
  });

  // 2. Tối ưu app/build.gradle: resConfigs và packagingOptions
  config = withAppBuildGradle(config, (config) => {
    let content = config.modResults.contents;

    // Giới hạn resConfigs: chỉ giữ tiếng Việt và tiếng Anh, loại bỏ hơn 80 ngôn ngữ rác từ thư viện bên thứ 3
    if (!content.includes('resConfigs "vi", "en"')) {
      content = content.replace(
        'defaultConfig {',
        'defaultConfig {\n        resConfigs "vi", "en"'
      );
    }

    // Tối ưu packagingOptions: loại bỏ debug symbols và các metadata thừa
    const targetLegacy = 'useLegacyPackaging enableLegacyPackaging.toBoolean()';
    if (content.includes(targetLegacy)) {
      const replacementPackaging = `useLegacyPackaging true
            keepDebugSymbols = []
        }
        resources {
            excludes += [
                "META-INF/*.version",
                "META-INF/*.txt",
                "META-INF/DEPENDENCIES",
                "META-INF/NOTICE",
                "META-INF/LICENSE*",
                "META-INF/*.kotlin_module",
                "**/libjscexecutor.so"
            ]`;
      content = content.replace(targetLegacy, replacementPackaging);
    }

    config.modResults.contents = content;
    return config;
  });

  return config;
};

module.exports = withAndroidOptimizations;
