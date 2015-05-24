UGLIFY = node_modules/uglify-js/bin/uglifyjs

all: min

min: js/main.min.js

js/main.min.js: \
	js/src/helpers.js\
	js/src/article.js\
	js/src/app.js\
	js/vendors/prism.min.js
	cat $^ | $(UGLIFY) > $@

clean:
	$(RM) -r js/main.min.js
