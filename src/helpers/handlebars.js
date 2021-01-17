var register = function (Handlebars) {
    var helpers = {
         equals: function(string1 ,string2 ,string3 , options) {
              if (string1 === string2 || string1 === string3 ) {
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
          },
          isNull: function(string1, options) {
              if (string1 === null ) {
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
          },
          // whichPartial: (context, options) =>  'dynamicPartial'
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;