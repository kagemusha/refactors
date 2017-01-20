import Ember from 'ember';
import RSVP from 'rsvp';
import { isBlank } from 'ember-utils';
import { bind } from 'ember-runloop';

const { get, set } = Ember;

export default {
  storeAndLoadImage(file) {
    return this.s3Direct().then(({ url, credentials })=> {
      return file.upload(url, {
        data: credentials
      });
    }).then((response)=> {
      return this.loadImage(response.headers.Location);
    });
  },
  loadImage (src, attributes={}) {
    if (isBlank(src)) { return null; }

    let { promise, resolve, reject } = RSVP.defer(`Loading Image "${src.slice(0, 30)}"`);
    let image = new Image();
    Object.keys(attributes).forEach(function (key) {
      image[key] = attributes[key];
    });

    image.onload = bind(null, function () {
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
      resolve(image);
    });

    image.onerror = bind(null, function () {
      reject(image);
    });
    image.crossOrigin = 'Anonymous';

    image.src = src;

    return promise;
  },

  s3Direct() {
    return new RSVP.Promise(function (resolve, reject) {
      Ember.$.get('/api/canvas/email_templates/upload/cred').then(resolve, reject);
    }, 'GET /api/canvas/email_templates/upload/cred');
  }

};
