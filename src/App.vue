<template>
  <div id="fudgePromotionsGalleryApp">
    <FudgePromotionsGallery
      api-url="http://127.0.0.1:8000"
      uuid="ddb5f29d-63f9-4679-8b43-f504b5b8f9f6"
      slug="carousel" />
  </div>
</template>

<script>
import FudgePromotionsGallery from './components/FudgePromotionsGallery.vue';

export default {
  name: 'FudgePromotionsGalleryApp',
  components: {
    FudgePromotionsGallery
  }
}
</script>
