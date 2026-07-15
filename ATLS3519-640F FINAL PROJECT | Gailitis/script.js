
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());

  document.querySelectorAll('[data-accordion] .accordion-item button').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const region = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(!expanded));
      if (region) region.hidden = expanded;
    });
  });

  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const errorSummary = form.querySelector('#form-errors');
      const success = form.querySelector('#form-success');
      const fields = Array.from(form.querySelectorAll('input, select, textarea')).filter(field => field.type !== 'submit' && field.type !== 'button');
      form.querySelectorAll('.field-error').forEach(el => el.remove());
      fields.forEach(field => field.removeAttribute('aria-invalid'));
      if (success) success.hidden = true;

      const errors = [];
      fields.forEach(field => {
        const value = field.value.trim();
        let message = '';
        if (field.hasAttribute('required') && !value) {
          message = 'This field is required.';
        } else if (field.type === 'email' && value) {
          const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!validEmail.test(value)) {
            message = 'Enter a valid email address.';
          }
        }
        if (message) {
          errors.push({ field, message });
          field.setAttribute('aria-invalid', 'true');
          const p = document.createElement('p');
          p.className = 'field-error';
          p.id = field.id + '-error';
          p.textContent = message;
          field.insertAdjacentElement('afterend', p);
          const describedBy = field.getAttribute('aria-describedby');
          field.setAttribute('aria-describedby', describedBy ? describedBy + ' ' + p.id : p.id);
        }
      });

      if (errors.length) {
        const heading = '<h3>Please fix the following ' + (errors.length === 1 ? 'issue' : 'issues') + ':</h3>';
        const items = errors.map(error => '<li><a href="#' + error.field.id + '">' + (form.querySelector('label[for="' + error.field.id + '"]')?.textContent.trim() || error.field.name) + ': ' + error.message + '</a></li>').join('');
        errorSummary.innerHTML = heading + '<ul>' + items + '</ul>';
        errorSummary.hidden = false;
        errors[0].field.focus();
      } else {
        errorSummary.hidden = true;
        errorSummary.innerHTML = '';
        if (success) success.hidden = false;
        form.reset();
      }
    });
  });
});
