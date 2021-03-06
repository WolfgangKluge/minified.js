module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		minitemplate: {
			options: {
				template: 'templates/page.template'
			},
			staticPages: {
				files: [{
			            expand: true,     
			            cwd: 'srcContent/',  
			            src: ['**/*.hson'],
			            dest: 'WebContent/',
			            ext: '.html'
			          
				}]
			}
		},
		
		writedocs: {
		    web: {
		      options: {  
		        destDir: 'srcContent/api/'
		      },
		      files: {
		    	  src: ['src/minified-web-src.js']
		      }
		    }
		},
		
		mergesrc: {
		    main: {
		      options: {
		    	  prolog: "\n\n// WARNING! This file is autogenerated from minified-shell.js and others.\n\n\n"
		      },
		      files: {
		    	  'src/minified-src.js': ['src/minified-shell.js', 'src/minified-web-src.js', 'src/minified-util-src.js']
		      }
		    }
		},
		
		rebuildsrc: {
			noie: {
				options: {
					config: "// minified.js config start -- use this comment to re-create your build configuration\n"+
					 "// - All sections except debug, ie6compatibility, ie7compatibility, ie8compatibility.\n"
				},
				files: {
					'WebContent/minified-src.noie.js': 'src/minified-src.js',
					'WebContent/minified-web-src.noie.js': 'src/minified-web-src.js'
				}
			},
			headless: {
				options: {
					config: "// minified.js config start -- use this comment to re-create your build configuration\n"+
					"// - All sections except ie6compatibility, ie7compatibility, ie8compatibility, ie9compatibility, amdfallback.\n",
					extraOptions: ['commonjs']
				},
				files: {
					'WebContent/minified-headless.js': 'src/minified-util-src.js',
				}
			}
		},
		
		htmlmin: {
		    dist: {
		      options: {  
		        removeComments: true,
		        collapseWhitespace: true
		      },
		      files: [{
		            expand: true,     
		            cwd: 'WebContent/',  
		            src: ['*.html', 'about/*.html', 'api/**/*.html', 'builder/*.html', 'docs/**/*.html', 'download/*.html'],
		            dest: 'WebContent/'		          
		      }]
		    }
		},
		
		'closurecompiler': {
			dist: {
				options: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS'
				},
				files: {
					'tmp/minified-web.js':      'src/minified-web-src.js',
					'tmp/minified-web.noie.js': 'WebContent/minified-web-src.noie.js',
					'tmp/minified-util.js':     'src/minified-util-src.js',
					'tmp/minified.noie.js':     'WebContent/minified-src.noie.js',
					'tmp/minified.js':          'src/minified-src.js'
				}
			}
		},
		
		uglify: {
			dist: {
				options: {
					compress: {
						hoist_vars: true,
						unsafe: true
					},
					mangle: {
					}					
				},
				files: {
					'WebContent/minified-web.js': 'tmp/minified-web.js',
					'WebContent/minified-web.noie.js': 'tmp/minified-web.noie.js',
					'WebContent/minified-util.js': 'tmp/minified-util.js',
					'WebContent/minified.noie.js': 'tmp/minified.noie.js',
					'WebContent/minified.js': 'tmp/minified.js',
					'WebContent/minified.test.js': 'tmp/minified.js' // b/c /minified.js not usable on Eclipse web server!
					
				}
			},
			
			site: {
				options: {
					compress: {
					},
					mangle: {
					}					
				},
				files: {
					'WebContent/js/builder.js': ['src/minified-src.js', 'srcContent/js/parser-src.js', 'srcContent/js/builder-src.js'],
					'WebContent/js/homepage.js': ['srcContent/js/minified-homepage.js', 'srcContent/js/homepage-src.js']
				}
			}
		},
		
		copy: {
			sources: {
				files: {
					'WebContent/minified-web-src.js': 'src/minified-web-src.js',
					'WebContent/minified-util-src.js': 'src/minified-util-src.js',
					'WebContent/minified-src.js': 'src/minified-src.js',
					'WebContent/test/minified-util.js': 'src/minified-util-src.js',
					'WebContent/test/sparkplug.js': 'srcContent/js/sparkplug-src.js'
				}
			},
			pngs: {
				files: {
					'WebContent/img/': 'srcContent/img/*.png'
				}
			},
			test: {
				files: [{
		            expand: true,     
		            cwd: 'srcContent/',  
		            src: ['examples/*.html', 'test/**/*.js', 'test/**/*.html', 'test/**/*.txt'],
		            dest: 'WebContent/'		          
		      }]
			}

		},
		
		cssmin: {
			site: {
				files: {
					'WebContent/css/minimum.css': 'srcContent/css/minimum.css',
					'WebContent/css/doc.css': ['srcContent/css/minimum.css', 'srcContent/css/doc.css'],
					'WebContent/css/links.css': ['srcContent/css/minimum.css', 'srcContent/css/links.css'],
					'WebContent/css/homepage.css': ['srcContent/css/minimum.css', 'srcContent/css/homepage.css'],
					'WebContent/css/reference.css': ['srcContent/css/minimum.css', 'srcContent/css/reference.css']
				}
			}
		},
		
		xmlmin: {
			site: {
			    files: [{
			            expand: true,     
			            cwd: 'srcContent/img',  
			            src: ['*.svg'],
			            dest: 'WebContent/img'		          
			    }]
			}
		},
		
		measuresize: {
			minified: {
				files: {
					'WebContent/minified-web.js': 'tmp/minified-web.js',
					'WebContent/minified-web.noie.js': 'tmp/minified-web.noie.js',
					'WebContent/minified-util.js': 'tmp/minified-util.js',
					'WebContent/minified.noie.js': 'tmp/minified.noie.js',
					'WebContent/minified.js': 'tmp/minified.js',
				}
			}
		},
		
		mochaTest: {
			util: {
				options: {
					bail: true,
				},
				src: [ 'src/test-util/*test.js' ]
			}
 	    },
		
		clean: {
			tmp: ['tmp'],
			webContent: ['WebContent']
		}
	});
	
	grunt.loadTasks('build/tasks/');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-closurecompiler');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-xmlmin');
	
	grunt.registerTask('assemble', ['mergesrc', 'rebuildsrc', 'copy:sources', 'copy:test']);
	grunt.registerTask('test', ['mochaTest']);
	grunt.registerTask('code', ['assemble', 'closurecompiler:dist', 'uglify', 'test', 'measuresize']);
	grunt.registerTask('site', ['uglify:site', 'writedocs', 'minitemplate', 'copy:pngs', 'copy:test', 'cssmin', 'htmlmin', 'xmlmin']);
	grunt.registerTask('all', ['code', 'site']);
	grunt.registerTask('default', ['code']);
	
	
};

