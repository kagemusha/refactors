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

moduleForAcceptance('Acceptance - custom image editor', {
  beforeEach() {
    this.campaignPic = server.create("campaign-pic");
    this.realLoadImage = this.uploadService.loadImage;
    visit(defaultCampaignUrl + "/new");
  },
  afterEach() {
  }
});

test('upload populates editor', assert => {
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
      assert.equal(currentURL(), defaultCampaignUrl);;
  });
});


