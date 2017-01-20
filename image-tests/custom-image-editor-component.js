import Ember from 'ember';
import BlockEditor from '../block-editor/component';
import method from 'ember-service-methods/inject-method';
import loadImage from 'email-builder/system/image-loader';
import Changeset from 'ember-changeset';

const { get, set } = Ember;

export default BlockEditor.extend({
  typeKey: 'custom-image',
  s3Direct: method(),

  vAlignments: ["top","middle","bottom","baseline"],
  alignments: ["left","right","center","justify"],

  actions: {
    addCustomImage(block, file) {
      return this.s3Direct().then(({ url, credentials }) => {
        return file.upload(url, {
          data: credentials
        });
      }).then((response) => {
        return loadImage(response.headers.Location);
      }).then((image) => {
        let { src, width, height } = image;
        block.setProperties({ typeKey: get(this, "typeKey"),
                              src,
                              imageWidth: width,
                              imageHeight: height,
                              valign: "top", align: "left",
                              isDirty: true
        });
        set(this, "changeset", new Changeset(block /*, validator */));
      });
    }
  }
});
