// Register helpers globally
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('or', (a, b) => a || b);
Handlebars.registerHelper('length', (arr) => arr.length);
Handlebars.registerHelper('gt', (a, b) => a > b);
Handlebars.registerHelper('var', (name, value, options) => {
  options.data.root[name] = value;
});
Handlebars.registerHelper('formatDate', (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

// -- Fetch and register any global partials --
// Register the taskItem partial
fetch('views/partials/taskItem.hbs')
  .then((response) => response.text())
  .then((partialContent) => {
    Handlebars.registerPartial('taskItem', partialContent);
  })
  .catch(error => {
    console.error('Error loading partial:', error);
  });