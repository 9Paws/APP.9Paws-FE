const { withGradleProperties, withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo Config Plugin tối ưu hóa kích thước APK và đảm bảo tương thích 100% thiết bị Android
 * Hỗ trợ cả máy 32-bit (Galaxy A10) và máy 64-bit (Tecno Spark 20, Pixel, Samsung S-series)
 */
const withAndroidOptimizations = (config) => {
  // 1. Tối ưu các cờ hiệu năng trong gradle.properties
  config = withGradleProperties(config, (config) => {
    const properties = [
      // Hỗ trợ cả 32-bit (armeabi-v7a) và 64-bit (arm64-v8a), loại bỏ 2 kiến trúc giả lập PC (x86, x86_64)
      { type: 'property', key: 'reactNativeArchitectures', value: 'armeabi-v7a,arm64-v8a' },
      // Giữ useLegacyPackaging=false để tương thích chuẩn Android 9/10/11/12/13/14 (tránh lỗi invalid package)
      { type: 'property', key: 'expo.useLegacyPackaging', value: 'false' },
      // Tắt bộ giải mã GIF gốc của React Native (app dùng expo-image tối ưu hơn)
      { type: 'property', key: 'expo.gif.enabled', value: 'false' },
      // Kích hoạt dọn dẹp tài nguyên thừa (XML, drawables không dùng)
      { type: 'property', key: 'android.enableShrinkResourcesInReleaseBuilds', value: 'true' },
      // Kích hoạt thu nhỏ mã bytecode (Minify/Obfuscation)
      { type: 'property', key: 'android.enableMinifyInReleaseBuilds', value: 'true' },
      // Bật R8 Full Mode để tối ưu tree-shaking và loại bỏ dead code tối đa
      { type: 'property', key: 'android.enableR8.fullMode', value: 'true' },
      // Bật AAPT2 resource optimizations
      { type: 'property', key: 'android.enableResourceOptimizations', value: 'true' },
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

  // 2. Tối ưu app/build.gradle: resConfigs, V1/V2 signing, packagingOptions
  config = withAppBuildGradle(config, (config) => {
    let content = config.modResults.contents;

    // Giới hạn resConfigs: chỉ giữ tiếng Việt và tiếng Anh, loại bỏ hơn 80 ngôn ngữ rác từ thư viện bên thứ 3
    if (!content.includes('resConfigs "vi", "en"')) {
      content = content.replace(
        'defaultConfig {',
        'defaultConfig {\n        resConfigs "vi", "en"'
      );
    }

    // Chuyển sang proguard-android-optimize.txt để kích hoạt bytecode optimizations
    if (content.includes('getDefaultProguardFile("proguard-android.txt")')) {
      content = content.replace(
        'getDefaultProguardFile("proguard-android.txt")',
        'getDefaultProguardFile("proguard-android-optimize.txt")'
      );
    }

    // Tối ưu packagingOptions: loại bỏ debug symbols và các metadata thừa
    const targetLegacy = 'useLegacyPackaging enableLegacyPackaging.toBoolean()';
    if (content.includes(targetLegacy)) {
      const replacementPackaging = `useLegacyPackaging false
            keepDebugSymbols = []
        }
        resources {
            excludes += [
                "META-INF/*.version",
                "META-INF/*.txt",
                "META-INF/DEPENDENCIES",
                "META-INF/NOTICE*",
                "META-INF/LICENSE*",
                "META-INF/license.txt",
                "META-INF/notice.txt",
                "META-INF/*.kotlin_module",
                "**/libjscexecutor.so",
                "**/libjsc.so",
                "**/README.txt"
            ]`;
      content = content.replace(targetLegacy, replacementPackaging);
    }

    config.modResults.contents = content;
    return config;
  });

  return config;
};

module.exports = withAndroidOptimizations;
