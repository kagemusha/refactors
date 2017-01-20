import page from '../pages/design-editor';
import Util from 'email-builder/system/util';
import { fileEvent, fakeStoreAndLoadImage } from './acceptance-helpers';

moduleForAcceptance('Acceptance - custom image editor', {
  beforeEach() {
    this.realStoreAndLoadImage = Util.storeAndLoadImage;
    Util.storeAndLoadImage = fakeStoreAndLoadImage;

    const emailTemplate = server.create('email-template', "withHtml" );
    this.campaignPic = server.create("campaign-pic", {email_template_ids: [emailTemplate.id]});
  },
  afterEach() {
    Util.storeAndloadImage = this.realStoreAndLoadImage;
  }
});

test('upload populates editor', function(assert) {
  page.visitTypeEditor(this.campaignPic.id, 'custom-image');
  click('.upload-custom-image .action-button');
  andThen(()=> {
    assert.ok($('.email-template_design_edit_block'));
    assert.equal($('input[type=file]').length, 1);
  });
  let event = fileEvent();

  andThen(function() {
    $('input[type=file]').trigger(event);
  });

  andThen(function() {
    assert.equal($('.custom-image-image-width-field').val(), "100");
    assert.equal($('.custom-image-image-height-field').val(), "100");
  });
});


