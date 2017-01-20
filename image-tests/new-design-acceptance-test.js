/* globals Image */
import Ember from 'ember';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import File from 'ember-file-upload/file';
import { wait } from 'fluid/helpers/wait';
import { test, skip } from 'ember-qunit';

const defaultCampaignUrl = '/campaigns/1/designs/desktop';

const fakeLoadImage = function(){
      const image = new Image(100, 100);
      image.src = "/cat.png";
      return Ember.RSVP.Promise.resolve(image);
    };

moduleForAcceptance('Acceptance - new design', {
  beforeEach() {
    this.campaignPic = server.create("campaign-pic");

    this.uploadService = this.application.__container__.lookup('service:upload-design');

    this.realLoadImage = this.uploadService.loadImage;
    this.uploadService.loadImage = fakeLoadImage;

    this.realGetDocumentColors = this.uploadService.getDocumentColors;
    this.uploadService.getDocumentColors =  () => {
      return ["#fc7c04", "#fc8404"];
    };

  },
  afterEach() {
    this.uploadService.loadImage = this.realLoadImage;
    this.uploadService.getDocumentColors = this.realGetDocumentColors;
  }
});

test('creating a new design from an image', assert => {
  visit(defaultCampaignUrl + "/new");
  andThen(()=> {
    assert.equal($('input[type=file]').length, 1);
  });
  let event = Ember.$.Event('change', {
    target: {
      files: [{
        name: "hello", type: "jpg"
      }]
    }
  });
  $('input[type=file]').trigger(event);
  andThen(() => {
    assert.equal(currentURL(), defaultCampaignUrl);
  });
});


