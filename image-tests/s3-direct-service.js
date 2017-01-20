import Ember from 'ember';
import method from 'ember-service-methods/method';

const { RSVP, $ } = Ember;

//NOT A REAL SERVICE
export default method(function () {
  return new RSVP.Promise(function (resolve, reject) {
    $.get('/api/canvas/email_templates/upload/cred').then(resolve, reject);
  }, 'GET /api/canvas/email_templates/upload/cred');
});
