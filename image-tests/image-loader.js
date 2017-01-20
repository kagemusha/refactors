import RSVP from 'rsvp';
import { isBlank } from 'ember-utils';
import { bind } from 'ember-runloop';

export default function (src, attributes={}) {
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
}
