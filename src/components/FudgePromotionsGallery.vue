<template>
  <div>

    <article v-if="isLoading" class="fpg-wrapper fpg-text-center">
      <div class="fpg-border-spinner fpg-border-spinner-primary fpg-mb-1" role="status"></div>
      <h2 class="fpg-main-title">Loading promotions...</h2>
      <p class="fpg-main-subtitle">
        We're just loading available promotions, please wait...
      </p>
    </article>
    <article v-else>
      <div v-if="promotions.length <= 0" class="fpg-wrapper fpg-text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="48" height="48" class="fpg-mb-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
        <h2 class="fpg-main-title">No promotions found</h2>
        <p class="fpg-main-subtitle">
          We don't currently have any new promotions to show you, we reguarly update our list of promotions so more are on the way, check back soon.
        </p>
      </div>
      <div v-else class="fpg-wrapper fpg-wrapper-list">

        <!-- Carousel -->
        <section v-if="displayType == 'carousel'">
          <transition-group name="slide" tag="div" class="fpg-gallery" mode="out-in">

            <!-- gallery cell -->
            <div
              class="fpg-gallery-cell"
              v-for="(promotion, promotionIndex) in promotions"
              v-show="(carousel.slides.current == promotionIndex-1 || carousel.slides.current == promotionIndex || carousel.slides.current == promotionIndex+1)"
              :class="{ 'fpg-gallery-cell-active': carousel.slides.current == promotionIndex }"
              :key="`slide-${promotionIndex}`">

              <!-- gallery media -->
              <div class="fpg-gallery-cell-media fpg-mb-2">
                <img v-if="promotion.image_type == 'url'" :src="promotion.image" :alt="promotion.title" class="fpg-img-fluid" />
                <img v-else-if="promotion.image_type == 'base64'" :src="`data:image/png;base64,${promotion.image}`" :alt="promotion.title" class="fpg-img-fluid" />
                <div v-else-if="promotion.image_type == 'svg'" v-html="promotion.image" class="fpg-img-fluid"></div>
              </div>

              <!-- gallery meta -->
              <div class="fpg-gallery-cell-content fpg-mb-2">
                <h2 class="fpg-gallery-cell-title">{{ promotion.title }}</h2>
                <p class="fpg-gallery-cell-subtitle fpg-text-truncate">{{ promotion.subtitle }}</p>
              </div>

              <!-- gallery features -->
              <div v-if="promotion.features.length > 0" class="fpg-gallery-cell-content fpg-mb-2">
                <ul class="fpg-gallery-cell-features">
                  <li
                    class="fpg-gallery-cell-feature fpg-text-truncate"
                    v-for="(feature, featureIndex) in promotion.features"
                    :key="featureIndex">
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <!-- gallery actions -->
              <div class="fpg-gallery-cell-actions">
                <a v-if="promotion.url_opens_in_new_tab" :href="promotion.url" target="_blank" title="Opens in new tab" class="fpg-btn fpg-btn-primary fpg-btn-sm">
                  {{ promotion.url_title }}
                </a>
                <a v-else :href="promotion.url" class="fpg-btn fpg-btn-primary fpg-btn-sm">
                  {{ promotion.url_title }}
                </a>
                <button :disabled="promotion.is_favourited" @click="logFavouritePromotion(promotion, promotionIndex)" title="Show more promotions like this." type="button" class="fpg-btn fpg-favourte-button fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_favourited }">
                  <svg v-if="promotion.is_favourited" xmlns="http://www.w3.org/2000/svg" fill="#10b981" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16" class="fpg-favourite-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

            </div>

          </transition-group>
          <article class="fpg-gallery-controls">
            <button @click="moveCarousel('prev')" type="button" class="fpg-btn fpg-gallery-control fpg-gallery-control-prev">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Prev
            </button>
            <button @click="moveCarousel('next')" type="button" class="fpg-btn fpg-gallery-control fpg-gallery-control-next">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </article>
        </section>

        <!-- List -->
        <section v-if="displayType == 'list'">
          <div
            class="fpg-list-card"
            v-for="(promotion, promotionIndex) in promotions">

            <!-- list media -->
            <div class="fpg-list-card-media">
              <img v-if="promotion.image_type == 'url'" :src="promotion.image" :alt="promotion.title" class="fpg-img-fluid" />
              <img v-else-if="promotion.image_type == 'base64'" :src="`data:image/png;base64,${promotion.image}`" :alt="promotion.title" class="fpg-img-fluid" />
              <div v-else-if="promotion.image_type == 'svg'" v-html="promotion.image" class="fpg-img-fluid"></div>
            </div>

            <!-- list content -->
            <div class="fpg-list-card-content">

              <!-- list meta -->
              <div class="fpg-list-card-meta">
                <div>
                  <h2 class="fpg-list-card-title">{{ promotion.title }}</h2>
                  <p class="fpg-list-card-subtitle fpg-text-truncate">{{ promotion.subtitle }}</p>
                </div>
              </div>

              <!-- gallery actions -->
              <div class="fpg-list-card-actions">
                <a v-if="promotion.url_opens_in_new_tab" :href="promotion.url" target="_blank" title="Opens in new tab" class="fpg-btn fpg-btn-primary fpg-btn-sm">
                  {{ promotion.url_title }}
                </a>
                <a v-else :href="promotion.url" class="fpg-btn fpg-btn-primary fpg-btn-sm">
                  {{ promotion.url_title }}
                </a>
                <button :disabled="promotion.is_favourited" @click="logFavouritePromotion(promotion, promotionIndex)" title="Show more promotions like this." type="button" class="fpg-btn fpg-favourte-button fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_favourited }">
                  <svg v-if="promotion.is_favourited" xmlns="http://www.w3.org/2000/svg" fill="#10b981" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16" class="fpg-favourite-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

            </div>

          </div>
        </section>

      </div>
    </article>

  </div>
</template>

<style scoped>
@import '../assets/css/fudge-promotions-gallery.css';
</style>

<script>
export default {
  props: {
    apiUrl: {
      type: String,
      default: 'https://api.fudge.tech/'
    },
    uuid: {
      type: String,
      default: ''
    },
    slug: {
      tpe: String,
      default: ''
    },
    displayType: {
      type: String,
      default: 'carousel'
    }
  },
  data () {
    return {
      carousel: {
        interval: null,
        slides: {
          current: 0,
          total: 0
        }
      },
      isLoading: true,
      promotions: []
    }
  },
  mounted () {
    this.getPromotions()
  },
  methods: {

    /*
    ** Remove trailing slash
    */
    removeTrailingSlash (str) {
      return str.replace(/\/+$/, '')
    },

    /*
    ** Construct API url
    */
    getApiUrl () {
      return `${this.removeTrailingSlash(this.apiUrl)}/api`
    },

    /*
    ** Get promotions
    */
    async getPromotions () {
      this.isLoading = true

      try {
        const promotions = (await this.$axios.get(`${this.getApiUrl()}/promotions`, {
          timeout: 15 * 1000,
          params: {
            uuid: this.uuid,
            slug: this.slug
          }
        })).data.promotions

        if (promotions.length > 0) {
          for (const [index, promotion] of promotions.entries()) {
            promotion.is_favourited = false
          }
        }

        this.promotions = promotions
      } catch (err) { }

      this.isLoading = false
    },

    /*
    ** Favourite promotion
    */
    async logFavouritePromotion (promotion, index) {
      this.promotions[index].is_favourited = true

      try {
        console.log('favourite this promotion')
        // const promotions = (await this.$axios.post(`${this.getApiUrl()}/promotions`, {
        //   timeout: 15 * 1000,
        //   params: {
        //     uuid: this.uuid,
        //     slug: this.slug
        //   }
        // })).data.promotions
      } catch (err) { }
    },

    /*
    ** Init carousel
    */
    initCarousel () {
      this.carousel.slides.total = this.promotions.length

      clearTimeout(this.carousel.interval)
      this.carousel.interval = setTimeout(() => {
        this.carousel.slides.current++

        this.initCarousel()
      }, 4 * 1000)
    },

    /*
    ** Move carousel
    */
    moveCarousel (direction = 'next') {
      this.initCarousel()

      if (direction == 'prev') {
        this.carousel.slides.current--
        return
      }

      this.carousel.slides.current++
    }

  }
}
</script>
