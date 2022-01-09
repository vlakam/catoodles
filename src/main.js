import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import App from './App.vue'
import './assets/main.css';

library.add(faTwitter);
library.add(faDiscord);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
