module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      default : {
        tsconfig: true
      }
    },
      watch: {
          scripts: {
              files: ["ts/*.ts"],
              tasks: ["ts"]
          }
      }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["ts", "watch"]);
};