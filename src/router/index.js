import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import eventsComponent from '@/components/events'
import infoComponent from '@/components/info'
import infoPostComponent from '@/components/infoPost'
import blogComponent from '@/components/blog'
import blogPostComponent from '@/components/blogPost'
import contactsComponent from '@/components/contacts'
import photosComponent from '@/components/photos'
import albumComponent from '@/components/album'
import eventPageComponent from '@/components/event'

import adminAuthComponent from '@/components/admin/admin-auth'
import adminSettingsComponent from '@/components/admin/admin-settings'

import adminEventsComponent from '@/components/admin/admin-events'
import adminNewsComponent from '@/components/admin/admin-news'
import adminBlogComponent from '@/components/admin/admin-blog'
import adminCuratorsComponent from '@/components/admin/admin-curator' 
import adminOrdersComponent from '@/components/admin/admin-order'
import adminClientsComponent from '@/components/admin/admin-clients'
import adminGSheetsComponent from '@/components/admin/admin-gsheets'
import adminIconsComponent from '@/components/admin/admin-icons'

import adminAdventuresComponent from '@/components/admin/mobile/admin-adventures.vue'
import adminAdventuresEditComponent from '@/components/admin/mobile/admin-adventures-edit.vue'
import adminMobileUsersComponent from '@/components/admin/mobile/admin-mobile-users.vue'
import adminMobileUsersEditComponent from '@/components/admin/mobile/admin-mobile-users-edit.vue'
import adminMobileFeedbackComponent from '@/components/admin/mobile/admin-feedback.vue'
import adminMobileAnnouncementsComponent from '@/components/admin/mobile/admin-announcements.vue'
import adminMobileCensoredComponent from '@/components/admin/mobile/admin-censored.vue'
import adminMobileBansComponent from '@/components/admin/mobile/admin-bans.vue'

import adminEventEditComponent from '@/components/admin/admin-event-edit'
import adminNewsEditComponent from '@/components/admin/admin-news-edit'
import adminBlogEditComponent from '@/components/admin/admin-blog-edit'
import adminCuratorsEditComponent from '@/components/admin/admin-curator-edit'
import adminOrdersEditComponent from '@/components/admin/admin-order-edit'
import adminClientsEditComponent from '@/components/admin/admin-clients-edit'

import bookingComponent from '@/components/booking/booking'
import bookingStage1Component from '@/components/booking/stage1'
import bookingStage2Component from '@/components/booking/stage2'
import bookingStage3Component from '@/components/booking/stage3'
import bookingSuccessComponent from '@/components/booking/success'
import paymentRedirectComponent from '@/components/booking/redirect'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  routes: [
    
    // MAIN SITE
    
    {
      path: '/info',
      name: 'info',
      component: infoComponent
    },
    {
      path: '/info/:id',
      name: 'info-post',
      component: infoPostComponent
    },
    {
      path: '/blog',
      name: 'blog',
      component: blogComponent
    },
    {
      path: '/blog/:id',
      name: 'blog-post',
      component: blogPostComponent
    },
    {
      path: '/',
      name: 'main-page',
      component: eventsComponent
    },
    {
      path: '/events',
      name: 'events',
      component: eventsComponent
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: contactsComponent
    },
    {
      path: '/photos',
      name: 'photos',
      component: photosComponent
    },
    {
      path: '/photos/:id',
      name: 'album',
      component: albumComponent
    },
//    {
//      path: '/event/:id/:dateid',
//      name: 'event-page',
//      component: eventPageComponent,
//      props: true
//    },
    
    
    
    
    // BOOKING
    
    {
      path: '/order/:id/:dateid',
      name: 'order-page',
      component: bookingComponent,
      props: true,
      redirect: '/order/:id/:dateid/stage-1',
      children: [
        {
          path: 'stage-1',
          component: bookingStage1Component,
          props: true,
        },
        {
          path: 'stage-2',
          component: bookingStage2Component,
          props: true,
        },
        {
          path: 'stage-3',
          component: bookingStage3Component,
          props: true,
        }
      ]
    },
    {
      path: '/payment/success/:id',
      name: 'payment-success-page',
      component: bookingSuccessComponent,
      props: true
    },
    {
      path: '/payment/redirect/:id',
      name: 'payment-redirect-page',
      component: paymentRedirectComponent,
      props: true
    },
    
    
    // ADMIN
    
    {
      path: '/admin',
      name: 'admin-auth',
      component: adminAuthComponent
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: adminSettingsComponent
    },
    {
      path: '/admin/events/visible',
      name: 'admin-events-visible',
      component: adminEventsComponent,
    },
    {
      path: '/admin/events/hidden',
      name: 'admin-events-hidden',
      component: adminEventsComponent,
    },
    {
      path: '/admin/event/edit/:id',
      name: 'admin-event-edit',
      component: adminEventEditComponent,
      props: true
    },
    {
      path: '/admin/news',
      name: 'admin-news',
      component: adminNewsComponent
    },
    {
      path: '/admin/news/edit/:id',
      name: 'admin-news-edit',
      component: adminNewsEditComponent,
      props: true
    },
    {
      path: '/admin/blog',
      name: 'admin-blog',
      component: adminBlogComponent
    },
    {
      path: '/admin/blog/edit/:id',
      name: 'admin-blog-edit',
      component: adminBlogEditComponent,
      props: true
    },
    {
      path: '/admin/curator',
      name: 'admin-curator',
      component: adminCuratorsComponent
    },
    {
      path: '/admin/curator/edit/:id',
      name: 'admin-curator-edit',
      component: adminCuratorsEditComponent,
      props: true
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: adminOrdersComponent
    },
    {
      path: '/admin/orders/edit/:id',
      name: 'admin-orders-edit',
      component: adminOrdersEditComponent,
      props: true
    },
    {
      path: '/admin/clients',
      name: 'admin-clients',
      component: adminClientsComponent
    },
    {
      path: '/admin/clients/edit/:id',
      name: 'admin-clients-edit',
      component: adminClientsEditComponent,
      props: true
    },
    {
      path: '/admin/gsheets/actual',
      name: 'admin-gsheets-actual',
      component: adminGSheetsComponent
    },
    {
      path: '/admin/gsheets/archive',
      name: 'admin-gsheets-archive',
      component: adminGSheetsComponent
    },
    {
      path: '/admin/icons',
      name: 'admin-icons',
      component: adminIconsComponent
    },
    
    {
      path: '/admin/mobile/adventures',
      name: 'admin-adventures',
      component: adminAdventuresComponent
    },
    
    {
      path: '/admin/mobile/adventures/edit/:id',
      name: 'admin-adventures-edit',
      component: adminAdventuresEditComponent,
      props: true,
    },
    
    {
      path: '/admin/mobile/users',
      name: 'admin-mobile-users',
      component: adminMobileUsersComponent,
    },
    
    {
      path: '/admin/mobile/users/edit/:id',
      name: 'admin-mobile-users-edit',
      component: adminMobileUsersEditComponent,
      props: true,
    },
    
    {
      path: '/admin/mobile/moderators/edit/:id',
      name: 'admin-mobile-moderators-edit',
      component: adminMobileUsersEditComponent,
      props: true,
    },
    
    {
      path: '/admin/mobile/feedback',
      name: 'admin-mobile-feedback',
      component: adminMobileFeedbackComponent,
    },
    
    {
      path: '/admin/mobile/announcements',
      name: 'admin-mobile-announcements',
      component: adminMobileAnnouncementsComponent,
    },
    
    {
      path: '/admin/mobile/censored',
      name: 'admin-mobile-censored',
      component: adminMobileCensoredComponent,
    },
    
    {
      path: '/admin/mobile/bans',
      name: 'admin-mobile-bans',
      component: adminMobileBansComponent,
    },
    
    
    
    // Event path placed here to prevent errors with routes
    
    {
      path: '/:id',
      name: 'event-page',
      component: eventPageComponent,
      props: true,
//      alias: '/:folder/:subfolder/:id/:dateid',
    },
    {
      path: '/:folder1/:id',
      name: 'event-page-1',
      component: eventPageComponent,
      props: true
    },
    {
      path: '/:folder1/:folder2/:id',
      name: 'event-page-2',
      component: eventPageComponent,
      props: true
    },
    {
      path: '/:folder1/:folder2/:folder3/:id',
      name: 'event-page-3',
      component: eventPageComponent,
      props: true
    },
    {
      path: '/:folder1/:folder2/:folder3/:folder4/:id',
      name: 'event-page-4',
      component: eventPageComponent,
      props: true
    },
    
  ],
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
})
