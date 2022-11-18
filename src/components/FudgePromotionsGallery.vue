<template>
  <div>

    <article v-if="isLoading" class="fpg-wrapper fpg-text-center">
      <article v-if="getOptions().initOnLoad">
        <div class="fpg-border-spinner fpg-border-spinner-primary fpg-mb-1" role="status"></div>
        <h2 class="fpg-main-title">Loading promotions...</h2>
        <p class="fpg-main-subtitle">
          We're just loading available promotions, please wait.
        </p>
      </article>
      <article v-else>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="48" height="48" class="fpg-mb-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <h2 class="fpg-main-title">Just a moment...</h2>
        <p class="fpg-main-subtitle">
          You'll soon be able to see our available promotions.
        </p>
      </article>
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
      <div v-else class="fpg-wrapper" :class="{ 'fpg-wrapper-list': displayType == 'list', 'fpg-wrapper-carousel-mini': displayType == 'carousel-mini' }">

        <!-- Carousel -->
        <section v-if="displayType == 'carousel'">
          <transition-group name="slide" tag="div" class="fpg-gallery" mode="out-in">

            <!-- gallery cell -->
            <div
              class="fpg-gallery-cell"
              v-for="(promotion, promotionIndex) in promotions"
              v-if="(carousel.slides.current == promotionIndex-1 || carousel.slides.current == promotionIndex || carousel.slides.current == promotionIndex+1)"
              :class="{ 'fpg-gallery-cell-active': carousel.slides.current == promotionIndex, 'fpg-gallery-cell-active-previous': carousel.slides.current == promotionIndex+1 }"
              :key="`slide-${promotionIndex}`">

              <!-- Promotion # number -->
              <div v-if="promotionIndex+1 < carousel.slides.initialTotal" class="fpg-gallery-cell-number">
                {{ promotionIndex+1 }} / {{ carousel.slides.initialTotal }}
              </div>
              <div v-else class="fpg-gallery-cell-number">
                {{ promotionIndex+1 }}
              </div>

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
                <button :disabled="promotion.is_redirecting" @click="redirectToPromotion(promotion, promotionIndex)" type="button" class="fpg-btn fpg-btn-primary fpg-btn-redirecter fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_redirecting }">
                  <div v-if="promotion.is_redirecting" class="fpg-border-spinner fpg-border-spinner-redirecter fpg-border-spinner-white fpg-mb-1" role="status"></div>
                  <div v-else>{{ promotion.url_title }}</div>
                </button>

                <a style="display: none; opacity: 0; height: 0;" :data-redirectTo="promotionIndex" :href="promotion.url" target="_blank">Open</a>

                <button :disabled="promotion.is_favourited" @click="logFavouritePromotion(promotion, promotionIndex)" title="Show more promotions like this." type="button" class="fpg-btn fpg-favourite-button fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_favourited }">
                  <svg v-if="promotion.is_favourited" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="#10b981" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" class="fpg-favourite-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>

                  <div v-show="shouldShowFavouriteTooltip" v-if="promotionIndex == 0 || promotionIndex == 1" class="fpg-favourite-tooltip">
                    <span>Tap to favourite offer</span>
                  </div>
                </button>
              </div>

              <div class="fpg-gallery-cell-progress">
                <div class="fpg-gallery-cell-progress-bar" :style="`width: ${promotion.current_progress}%`" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

          </transition-group>
          <article v-if="getOptions().controls" class="fpg-gallery-controls">
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

        <!-- Carousel (mini) -->
        <section v-if="displayType == 'carousel-mini'">
          <transition-group name="slide" tag="div" class="fpg-gallery fpg-gallery-mini" mode="out-in">

            <!-- gallery cell -->
            <div
              class="fpg-gallery-cell"
              v-for="(promotion, promotionIndex) in promotions"
              v-if="carousel.slides.current == promotionIndex"
              :class="{ 'fpg-gallery-cell-active': carousel.slides.current == promotionIndex }"
              :key="`slide-${promotionIndex}`">

              <!-- Promotion # number -->
              <div v-if="promotionIndex+1 < carousel.slides.initialTotal" class="fpg-gallery-cell-number">
                {{ promotionIndex+1 }} / {{ carousel.slides.initialTotal }}
              </div>
              <div v-else class="fpg-gallery-cell-number">
                {{ promotionIndex+1 }}
              </div>

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
                <button :disabled="promotion.is_redirecting" @click="redirectToPromotion(promotion, promotionIndex)" type="button" class="fpg-btn fpg-btn-primary fpg-btn-redirecter fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_redirecting }">
                  <div v-if="promotion.is_redirecting" class="fpg-border-spinner fpg-border-spinner-redirecter fpg-border-spinner-white fpg-mb-1" role="status"></div>
                  <div v-else>{{ promotion.url_title }}</div>
                </button>

                <a style="display: none; opacity: 0; height: 0;" :data-redirectTo="promotionIndex" :href="promotion.url" target="_blank">Open</a>

                <button :disabled="promotion.is_favourited" @click="logFavouritePromotion(promotion, promotionIndex)" title="Show more promotions like this." type="button" class="fpg-btn fpg-favourite-button fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_favourited }">
                  <svg v-if="promotion.is_favourited" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="#10b981" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" class="fpg-favourite-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>

                  <div v-show="shouldShowFavouriteTooltip" v-if="promotionIndex == 0 || promotionIndex == 1" class="fpg-favourite-tooltip">
                    <span>Tap to favourite offer</span>
                  </div>
                </button>
              </div>

              <div class="fpg-gallery-cell-progress">
                <div class="fpg-gallery-cell-progress-bar" :style="`width: ${promotion.current_progress}%`" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

          </transition-group>
          <article v-if="getOptions().controls" class="fpg-gallery-controls">
            <button @click="moveCarousel('prev')" type="button" class="fpg-btn fpg-gallery-control fpg-gallery-control-prev">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button @click="moveCarousel('next')" type="button" class="fpg-btn fpg-gallery-control fpg-gallery-control-next">
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
              <img v-if="promotion.image_type == 'url'" :src="promotion.image" alt="Promotion image" class="fpg-img-fluid" />
              <img v-else-if="promotion.image_type == 'base64'" :src="`data:image/png;base64,${promotion.image}`" :alt="promotion.title" class="fpg-img-fluid" />
              <div v-else-if="promotion.image_type == 'svg'" v-html="promotion.image" class="fpg-img-fluid"></div>
            </div>

            <!-- list content -->
            <div class="fpg-list-card-content">

              <!-- list meta -->
              <div class="fpg-list-card-meta">
                <div>
                  <h2 class="fpg-list-card-title">{{ promotion.title }}</h2>
                  <p class="fpg-list-card-subtitle">{{ promotion.subtitle }}</p>
                </div>
              </div>

              <!-- gallery actions -->
              <div class="fpg-list-card-actions">
                <button :disabled="promotion.is_redirecting" @click="redirectToPromotion(promotion, promotionIndex)" type="button" class="fpg-btn fpg-btn-primary fpg-btn-redirecter fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_redirecting }">
                  <div v-if="promotion.is_redirecting" class="fpg-border-spinner fpg-border-spinner-redirecter fpg-border-spinner-white fpg-mb-1" role="status"></div>
                  <div v-else>{{ promotion.url_title }}</div>
                </button>

                <a style="display: none; opacity: 0; height: 0;" :data-redirectTo="promotionIndex" :href="promotion.url" target="_blank">Open</a>

                <button :disabled="promotion.is_favourited" @click="logFavouritePromotion(promotion, promotionIndex)" title="Show more promotions like this." type="button" class="fpg-btn fpg-favourite-button fpg-btn-sm" :class="{ 'fpg-btn-disabled': promotion.is_favourited }">
                  <svg v-if="promotion.is_favourited" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="#10b981" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16" class="fpg-favourite-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>

                  <div v-show="shouldShowFavouriteTooltip" v-if="promotionIndex == 0 || promotionIndex == 1" class="fpg-favourite-tooltip">
                    <span>Tap to favourite offer</span>
                  </div>
                </button>
              </div>

            </div>

            <div v-if="promotion.features_formatted && promotion.features_formatted.length > 0" class="fpg-list-card-features">
              <div
                class="fpg-list-card-accordion"
                v-for="(feature, featureIndex) in promotion.features_formatted.slice(0, 3)"
                :key="featureIndex">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" fill="#fbbf24" class="fpg-list-card-star">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                  </svg>
                  <p>
                    {{ feature.content.substring(0, list.features.maxLength) }}
                    <span v-if="feature.content.length > list.features.maxLength && !feature.is_feature_expanded">...</span>
                  </p>
                  <div v-if="feature.content.length > list.features.maxLength">
                    <p v-show="feature.is_feature_expanded">
                      {{ feature.content.substring(list.features.maxLength, feature.content.length) }}
                    </p>
                  </div>
                </div>
                <div v-if="feature.content.length > list.features.maxLength" class="fpg-ml-auto">
                  <div v-if="!feature.is_feature_expanded" @click="feature.is_feature_expanded = true" class="fpg-cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" fill="none" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div v-if="feature.is_feature_expanded" style="display: inline;" @click="feature.is_feature_expanded = false" class="fpg-cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" fill="none" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
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
      default: 'http://127.0.0.1:8000/'
    },
    uuid: {
      type: String,
      default: 'ddb5f29d-63f9-4679-8b43-f504b5b8f9f6'
    },
    slug: {
      type: String,
      default: 'carousel'
    },
    displayType: {
      type: String,
      default: 'carousel'
    },
    options: {
      type: String,
      default: '{}'
    }
  },
  data () {
    return {
      clientIp: null,
      settings: {
        initOnLoad: true,
        debug: false,
        autoplay: false,
        controls: true,
        delay: 5000
      },
      shouldShowFavouriteTooltip: false,
      carousel: {
        interval: null,
        isPaused: false,
        slides: {
          current: 0,
          displayCurrent: 1,
          total: 0,
          initialTotal: 0
        }
      },
      list: {
        features: {
          maxLength: 33
        }
      },
      isLoading: true,
      promotions: [],
      applicant: null,
      attribution: {
        affiliate: 'fudge_gallery',
        campaign: 'fudge_gallery'
      }
    }
  },
  mounted () {
    if (this.getOptions().debug) {
      console.log('FPG: mounted hook has executed')
    }

    this.initFpgEventListeners()

    // delay to give event listeners time to set
    setTimeout(() => {
      this.dispatchPluginEvent('fpg:on:load')

      if (this.getOptions().initOnLoad) {
        this.initWebComponent()
      } else {
        if (this.getOptions().debug) {
          console.log('FPG: initOnLoad has been set to false, you must call the fpg:init event to run the component.')
        }
      }
    }, 100)

    // set client IP address
    this.setClientIp()
    this.hasSeenFavouriteTooltip()
  },
  methods: {

    /*
    ** Get options
    */
    getAxiosInstance () {
      if (process.env.NODE_ENV == 'production') {
        return axios || window.axios
      }

      return this.$axios
    },

    /*
    ** Determine if we've already seen the promotion tooltip
    */
    hasSeenFavouriteTooltip () {
      try {
        if (localStorage.getItem('fpg__seen-favourite-tooltip')) {
          this.shouldShowFavouriteTooltip = false
          return
        }

        this.shouldShowFavouriteTooltip = true

        localStorage.setItem('fpg__seen-favourite-tooltip', true)
      } catch (err) { }
    },

    /*
    ** Kick-start the web component
    */
    initWebComponent () {
      if (this.getOptions().debug) {
        console.log('FPG: initWebComponent has been called')
      }

      this.dispatchPluginEvent('fpg:on:init')
      this.setAttributionDetails()
      this.getPromotions()
      this.logPromotionSession()
    },

    /*
    ** Get the client hostname
    */
    getRequestHostname () {
      try {
        return window.location.hostname
      } catch (err) { }

      return null
    },

    /*
    ** Set the client IP address
    */
    async setClientIp () {
      try {

        // use cache
        if (sessionStorage.getItem('fpg__client-ip')) {
          this.clientIp = sessionStorage.getItem('fpg__client-ip')
          return
        }

        // pull & set fresh IP
        const ip = (await this.getAxiosInstance().get('https://api.ipify.org?format=json', {
          timeout: 10 * 1000
        })).data.ip

        if (ip) {
          this.clientIp = ip

          try {
            localStorage.setItem('fpg__client-ip', this.clientIp)
            sessionStorage.setItem('fpg__client-ip', this.clientIp)
          } catch (err) { }
        }

      } catch (err) { }
    },

    /*
    ** Get the client IP address
    */
    getClientIp () {
      let ip = '127.0.0.1'

      try {
        if (localStorage.getItem('fpg__client-ip')) {
          ip = localStorage.getItem('fpg__client-ip')
        }
      } catch (err) { }

      return ip
    },

    /*
    ** Set attribution details via different methods
    */
    setAttributionDetails () {

      // set affiliate
      if (this.getOptions().attribution_affiliate && this.getOptions().attribution_affiliate != '') {
        this.attribution.affiliate = this.getOptions().attribution_affiliate
      }

      if (this.applicant && (this.applicant.attribution_affiliate && this.applicant.attribution_affiliate != '')) {
        this.attribution.affiliate = this.applicant.attribution_affiliate
      }

      // set campaign
      if (this.getOptions().attribution_campaign && this.getOptions().attribution_campaign != '') {
        this.attribution.campaign = this.getOptions().attribution_campaign
      }

      if (this.applicant && (this.applicant.attribution_campaign && this.applicant.attribution_campaign != '')) {
        this.attribution.campaign = this.applicant.attribution_campaign
      }

    },

    /*
    ** Get options
    */
    getOptions () {
      return {
        ...this.settings,
        ...JSON.parse(this.options)
      }
    },

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
    ** Get formatted offer URL with
    */
    getParsedPromotionUrl (url = '') {
      let formattedUrl = url

      if (url.includes('{attribution_affiliate}')) {
        if (this.getOptions().debug) {
          console.log('FPG: setting affiliate via URL method')
        }

        formattedUrl = url.replace('{attribution_affiliate}', this.attribution.affiliate)
      }

      if (url.includes('{attribution_campaign}')) {
        if (this.getOptions().debug) {
          console.log('FPG: setting campaign via URL method')
        }

        formattedUrl = url.replace('{attribution_campaign}', this.attribution.campaign)
      }

      return formattedUrl
    },

    /*
    ** Get promotions
    */
    async getPromotions () {
      this.isLoading = true

      try {
        const promotions = (await this.getAxiosInstance().get(`${this.getApiUrl()}/promotions`, {
          timeout: 15 * 1000,
          params: {
            uuid: this.uuid,
            slug: this.slug,
            applicant: this.applicant,
            client: {
              hostname: this.getRequestHostname(),
              ip: this.getClientIp()
            }
          }
        })).data.promotions

        if (promotions.length > 0) {
          for (const [index, promotion] of promotions.entries()) {
            promotion.is_favourited = false
            promotion.is_redirecting = false
            promotion.current_progress = 0

            if (promotion.features.length) {
              let formattedFeatures = []

              for (const [index, feature] of promotion.features.entries()) {
                formattedFeatures.push({
                  content: feature,
                  is_feature_expanded: false
                })
              }

              promotion.features_formatted = formattedFeatures
            }

          }
        }

        this.promotions = promotions
        this.carousel.slides.initialTotal = this.promotions.length

        // if autoplay is enabled
        if (this.getOptions().autoplay) {
          this.initCarousel()
        }

      } catch (err) {
        if (this.getOptions().debug) {
          console.log('FPG: getPromotions request error, error follows...')
          console.log(err)
        }
      }

      this.isLoading = false
    },

    /*
    ** Log page view
    */
    async logPromotionSession () {
      this.dispatchPluginEvent('fpg:on:promotion-view')
      try {
        await this.getAxiosInstance().post(`${this.getApiUrl()}/promotions`, {
          action: 'record_session',
          uuid: this.uuid,
          slug: this.slug,
          client: {
            hostname: this.getRequestHostname(),
            ip: this.getClientIp()
          }
        }, {
          timeout: 5 * 1000
        })
      } catch (err) {
        if (this.getOptions().debug) {
          console.log('FPG: logPromotionSession request error, error follows...')
          console.log(err)
        }
      }
    },

    /*
    ** Favourite promotion
    */
    async logFavouritePromotion (promotion, index) {
      this.dispatchPluginEvent('fpg:on:promotion-favourite')
      this.promotions[index].is_favourited = true

      try {
        await this.getAxiosInstance().post(`${this.getApiUrl()}/promotions`, {
          action: 'record_favourite',
          promotion_id: promotion.id,
          uuid: this.uuid,
          slug: this.slug,
          client: {
            hostname: this.getRequestHostname(),
            ip: this.getClientIp()
          }
        }, {
          timeout: 10 * 1000
        })
      } catch (err) {
        if (this.getOptions().debug) {
          console.log('FPG: logFavouritePromotion request error, error follows...')
          console.log(err)
        }
      }
    },

    /*
    ** Rediret to promotion
    */
    async redirectToPromotion (promotion, index) {
      this.dispatchPluginEvent('fpg:on:promotion-click')
      this.promotions[index].is_redirecting = true

      // record click
      try {
        await this.getAxiosInstance().post(`${this.getApiUrl()}/promotions`, {
          action: 'record_click',
          promotion_id: promotion.id,
          uuid: this.uuid,
          slug: this.slug,
          client: {
            hostname: this.getRequestHostname(),
            ip: this.getClientIp()
          }
        }, {
          timeout: 3 * 1000
        })
      } catch (err) {
        if (this.getOptions().debug) {
          console.log('FPG: redirectToPromotion request error, error follows...')
          console.log(err)
        }
      }

      const promotionUrl = this.getParsedPromotionUrl(promotion.url)

      if (this.getOptions().debug) {
        console.log('FPG: promotion URL looks like...')
        console.log(promotionUrl)
      }

      // redirect via new tab
      if (promotion.url_opens_in_new_tab) {
        let redirector = document.querySelector(`[data-redirectTo="${index}"]`)
        if (!redirector) {
          let fpg = document.querySelector('fudge-promotions-gallery')
          if (fpg) {
            redirector = fpg.shadowRoot.querySelector(`[data-redirectTo="${index}"]`)
          }
        }

        if (redirector) {
          redirector.href = promotionUrl
          redirector.click()
        } else {
          if (this.getOptions().debug) {
            console.log('FPG: redirector element not found')
            console.log(redirector)
          }
        }

        this.promotions[index].is_redirecting = false
        return
      }

      // redirect existing tab
      window.location.replace(promotionUrl)
      window.location.href = promotionUrl
      this.promotions[index].is_redirecting = false
    },

    /*
    ** Init carousel
    */
    initCarousel () {
      this.carousel.slides.total = this.promotions.length

      for (const [index, promotion] of this.promotions.entries()) {
        if (this.promotions[index] != null) {
          this.promotions[index].current_progress = 0
        }
      }

      if (this.promotions[this.carousel.slides.current] != null) {
        this.promotions[this.carousel.slides.current].current_progress = 100
      }

      clearTimeout(this.carousel.interval)
      this.carousel.interval = setTimeout(() => {

        if (this.carousel.slides.current >= this.carousel.slides.initialTotal-1) {
          this.carousel.slides.current = 0
          this.initCarousel()
          return
        }

        // if carousel is paused
        if (this.carousel.isPaused) {
          this.initCarousel()
          return
        }

        this.carousel.slides.current++

        this.initCarousel()
      }, this.getOptions().delay)
    },

    /*
    ** Move carousel
    */
    moveCarousel (direction = 'next') {
      if (direction == 'prev') {
        if (this.carousel.slides.current < 1) {
          return
        }

        if (this.promotions[this.carousel.slides.current] != null) {
          this.promotions[this.carousel.slides.current].current_progress = 0
        }

        this.carousel.slides.current--
        return
      }

      if (this.carousel.slides.current >= this.carousel.slides.initialTotal-1) {
        this.carousel.slides.current = 0
        return
      }

      this.carousel.slides.current++

      if (this.promotions[this.carousel.slides.current] != null) {
        this.promotions[this.carousel.slides.current].current_progress = 100
      }

      if (this.getOptions().autoplay) {
        this.initCarousel()
      }
    },

    /*
    ** trigger event
    */
    dispatchPluginEvent (evtName) {
      try {
        document.dispatchEvent(new Event(evtName))
      } catch (err) {
        if (this.getOptions().debug) {
          console.log(`FPG: (${evtName}) dispatchPluginEvent error, error follows...`)
          console.log(err)
        }
      }
    },

    /*
    ** init custom event listeners
    */
    initFpgEventListeners () {
      const self = this

      if (this.getOptions().debug) {
        console.log('FPG: initFpgEventListeners has been called')
      }

      // init the plugin
      document.addEventListener('fpg:init', this.initWebComponent)

      // set an applicant
      document.addEventListener('fpg:applicant:set', function (evt) {
        self.applicant = evt.detail

        if (self.getOptions().debug) {
          console.log(`FPG: fpg:applicant:set event dispatched, event data follows...`)
          console.log(evt)
        }

        setTimeout(() => {
          self.setAttributionDetails()
          self.getPromotions()
        }, 50)
      }, false)

      // init the carousel
      document.addEventListener('fpg:carousel:init', function (evt) {
        self.initCarousel()
      }, false)

      // init the carousel
      document.addEventListener('fpg:carousel:pause', function (evt) {
        self.carousel.isPaused = true
        clearTimeout(this.carousel.interval)
      }, false)

      // init the carousel
      document.addEventListener('fpg:carousel:play', function (evt) {
        self.carousel.isPaused = false
        self.initCarousel()
      }, false)
    }

  }
}
</script>
