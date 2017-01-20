import Ember from 'ember';
import BlockEditor from '../block-editor/component';
import Util from 'email-builder/system/util';
import Changeset from 'ember-changeset';

const { get, set } = Ember;

export default BlockEditor.extend({
  typeKey: 'custom-image',

  vAlignments: ["top","middle","bottom","baseline"],
  alignments: ["left","right","center","justify"],

  actions: {
    addCustomImage(block, file) {
      Util.storeAndLoadImage(file).then((image) => {
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
