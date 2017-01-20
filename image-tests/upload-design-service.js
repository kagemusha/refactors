/* global ColorThief, tinycolor */
import Ember from 'ember';
import method from 'ember-service-methods/inject-method';
import Block from '../models/block';
import loadImage from '../system/image-loader';

const { get, set } = Ember;
const { service } = Ember.inject;

export default Ember.Service.extend({

  store: service(),

  s3Direct: method(),

  execute(design, file) {
    let email = get(design, 'email');
    let campaignPic = get(email, 'campaignPic');

    return this.loadImage(file).then((image)=> {
      let { src, width, height } = image;
      let block = Block.create({
        parent: design,
        typeKey: "original-image",
        section: {typeKey: 'original-image', width, height},
        src,
        width,
        height,
      });
      //todo: cleanup type/typeKey: should only be in one place

      const documentColors = this.getDocumentColors(image);
      get(design, 'email.documentColors').pushObjects(documentColors);
      set(design, "section", {typeKey: "original-image", height, width});
      design.setProperties({
        src, width, height,
        children: [block]
      });

      return email.get('html');
    }).then((html) => {
      let template = get(this, 'store').createRecord('email-template', {
        campaignPic,
        html,
        sections: design.getSections()
      });
      set(email, 'emailTemplate', template);

      return template.save();
    });
  },

  loadImage(file) {
    return this.s3Direct().then(({ url, credentials })=> {
      return file.upload(url, {
        data: credentials
      });
    }).then((response)=> {
      return loadImage(response.headers.Location);
    });
  },

  getDocumentColors(image) {
    let thief = new ColorThief();
    return thief.getPalette(image, 10, 1).map(function ([r, g, b]) {
      return tinycolor.fromRatio({ r, g, b }).toHexString();
    });
  }

});

