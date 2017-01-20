/* globals Image */
import Ember from 'ember';

export function fakeStoreAndLoadImage() {
  const image = new Image(100, 100);
  image.src = "/cat.png";
  return Ember.RSVP.Promise.resolve(image);
}

export function fileEvent(name="hello", type="jpg") {
  return Ember.$.Event('change', {
    target: {
      files: [{ name, type }]
    }
  });
}
