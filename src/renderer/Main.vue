<template>
  <ion-menu content-id="main">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu Content</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
        <ion-list>
          <ion-menu-toggle> 
            <ion-item>
              <ion-label  @click="onClickSidebar(0)">News</ion-label>
            </ion-item>
            <ion-item>
              <ion-label @click="onClickSidebar(1)">Home</ion-label>
            </ion-item>
            <ion-item>
              <ion-label @click="onClickSidebar(2)">Profile</ion-label>
            </ion-item>
            <ion-item>
              <ion-label @click="onClickSidebar(3)">Settings</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Support</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Feedback</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>About</ion-label>
            </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
  <ion-page id="main">
    <ion-header id="header">
      <ion-buttons class="button" slot="start">
        <ion-menu-button id="menuButton"></ion-menu-button>
      </ion-buttons>
    </ion-header>

    <ion-content id="test3" class="ion-padding"> 
      <p v-if="active[0] == true">
        <div v-for="data in serverNewsData">
          <ion-card>
            <ion-card-header>
              <ion-card-title> {{ data.title }} </ion-card-title>
              <ion-card-subtitle> {{ data.date }} </ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              {{ data.content }}
            </ion-card-content>
          </ion-card>
        </div> 
      </p>

      <p v-if="active[1] == true">
        <div v-for="data in serverPostData">
          <ion-card :disabled="isDisabled" @click="onViewPost(data.id)">
            <img class="card" alt="card image" :src="data.image"/>
            <ion-card-header>
              <ion-card-title> {{ data.title }} </ion-card-title>
              <ion-card-subtitle> {{ data.date }} </ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              {{ data.content }}
            </ion-card-content>
          </ion-card>
        </div> 
        
        <ion-fab class="fab" :activated="buttonStatus" slot="fixed" vertical="bottom" horizontal="end">
          <ion-fab-button id="postButton" @click="onCreatePost()">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="end"></ion-fab-list>
        </ion-fab>
      </p>
    </ion-content>
    
    <Transition name="slide">
      <p v-if="showModal">
        <ion-card class="page">
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
          <p v-if="modal == 0">
            <div id="date">
              <ion-datetime fill="outline"></ion-datetime>
            </div>
          </p>
          <p v-if="modal == 1">
            <ion-input class="input" label="Job Description" label-placement="floating" fill="outline" placeholder="Enter text"></ion-input>

            <ion-select class="input" fill="outline" interface="action-sheet" placeholder="State">
              <div v-for="state in states">
                <ion-select-option :value="`${state}`">{{ state }}</ion-select-option>
              </div> 
            </ion-select>

            <ion-input class="input" label="City" label-placement="floating" fill="outline" placeholder="Enter text"></ion-input>
          </p>
          <ion-button id="next" fill="clear"  @click="onClickModal(true)">Next</ion-button>
          <ion-button id="back" fill="clear"  @click="onClickModal(false)">Back</ion-button>
        </ion-card>
      </p>
    </Transition>

    <Transition name="slide">
      <p v-if="postLoaded">
        <ion-card class="page">
          <div class="header">
            <ion-label color="dark">
              <h1 class="item-header"> {{ currentPostData.title }} </h1>
              <ion-list>
                <ion-item>
                  <ion-icon aria-hidden="true" :icon="person" slot="start"></ion-icon>
                  <ion-label class="item-label"> {{ currentPostData.user }}</ion-label>
                </ion-item>
                <ion-item> 
                  <ion-icon aria-hidden="true" :icon="location" slot="start"></ion-icon>
                  <ion-label class="item-label"> {{ currentPostData.location }}</ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon aria-hidden="true" :icon="calendar" slot="start"></ion-icon>
                  <ion-label class="item-label"> {{ currentPostData.date }}</ion-label>
                </ion-item>
              </ion-list> 
            </ion-label> 
            <ion-label class="modalContent">
              {{ currentPostData.content }} 
            </ion-label>
          </div>
        </ion-card>
      </p>
    </Transition>

    <ion-footer>
      <ion-toolbar>
        <ion-tabs>
          <ion-router-outlet></ion-router-outlet>        
            <ion-tab-bar slot="bottom">
              <ion-tab-button tab="news" :disabled=isDisabled hred="/news" @click="onChangePage(0)">
                <p v-if="active[0] == false">
                  <ion-icon class="tab" :icon="newspaperOutline"/>
                </p>
                <p v-else>
                  <ion-icon class="tab" :icon="newspaper"/>            
                </p>
              </ion-tab-button>

              <ion-tab-button tab="home" :disabled=isDisabled hred="/home" @click="onChangePage(1)">
                <p v-if="active[1] == false">
                  <ion-icon class="tab" :icon="homeOutline"/>
                </p>
                <p v-else>
                  <ion-icon class="tab" :icon="home"/>            
                </p>
              </ion-tab-button>

              <ion-tab-button tab="profile" :disabled=isDisabled hred="/profile" @click="onChangePage(2)">
                <p v-if="active[2] == false">
                  <ion-icon class="tab" :icon="personOutline"/>
                </p>
                <p v-else>
                  <ion-icon class="tab" :icon="person"/>            
                </p>
              </ion-tab-button>

              <ion-tab-button tab="setting" :disabled=isDisabled hred="/setting" @click="onChangePage(3)">
                <p v-if="active[3] == false">
                  <ion-icon class="tab" :icon="settingsOutline"/>
                </p>
                <p v-else>
                  <ion-icon class="tab" :icon="settings"/>            
                </p>
              </ion-tab-button>        
            </ion-tab-bar> 
          </ion-tabs>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
  
  
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useIonRouter } from '@ionic/vue'
import { newspaper, newspaperOutline, home, homeOutline, person, personOutline, settings, settingsOutline, menu, menuOutline, chatboxOutline, chatboxEllipsesOutline, add, document, colorPalette, globe, locationOutline, location, calendar } from 'ionicons/icons';
import { IonPage, IonContent, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons, IonMenu, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFab, IonFabButton, IonFabList, IonList, IonItem, IonFooter, IonInput, IonSelect, IonSelectOption, IonProgressBar, IonButton, IonDatetime, IonMenuToggle } from '@ionic/vue';


const controller = new AbortController();
const signal = controller.signal;
const url = "video.mp4";

async function postData(url = "aws.json2json.com/postss", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

let states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
let active = ref([true, false, false, false])
let displayPost = ref(false);
let modal = ref(0)
let disable = ref(false)

let buttonStatus = ref(false);

function stall(func: () => void, ms: number | undefined) {
  return new Promise(() => {
      setTimeout(func, ms)
  })
}

export default defineComponent({
  name: "AppHeader",
  components: { IonPage, IonContent, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons, IonMenu, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFab, IonFabButton, IonFabList, IonList, IonItem, IonFooter, IonInput, IonSelect, IonSelectOption, IonProgressBar, IonButton, IonDatetime, IonMenuToggle },
  data() {
    return { 
      currentPostData: [],
      serverNewsData: [],
      serverPostData: [],
      newspaper, newspaperOutline, home, homeOutline, person, personOutline, settings, settingsOutline, menu, menuOutline, chatboxOutline, chatboxEllipsesOutline, add, document, colorPalette, globe, active, modal, states, displayPost, buttonStatus, locationOutline, location, calendar
    };
  },
  setup() {
    const ionRouter = useIonRouter();
  },
  methods: {
    async getNewsData() : Promise<Record<string, any>[]> {
      const response = await fetch('src/assets/testData.json')
      const data = await response.json();
      this.serverNewsData = data;
      return data;
    },
    async getPostData() : Promise<Record<string, any>[]> {
      const response = await fetch('src/assets/testPosts.json')
      const data = await response.json();
      this.serverPostData = data;
      return data;
    },
    async getPostDataForIndex(index: number) : Promise<Record<string, any>[]> {
      disable.value = !disable.value;
      const response = await fetch('src/assets/testPosts.json')
      const data = await response.json();
      this.currentPostData = data[index];
      return data;
    },
    onChangePage(page: number) {
      active.value = [false, false, false, false];
      active.value[page] = true;
    },
    onClickModal(direction: boolean) {
      if (direction == true) {
        modal.value ++;
      }
      else if (modal.value > 0) {
        modal.value --;
      }
    },
    onCreatePost() {
      stall(() => {buttonStatus.value = false}, 1)
      displayPost.value = false;
      disable.value = !disable.value;
    },
    onViewPost(post: number) {
      this.getPostDataForIndex(post);
      buttonStatus.value = true;
      disable.value = true;
      displayPost.value = true;
    },
    onClickSidebar(option: number) {
      console.log(option);
      active.value = [false, false, false, false];
      active.value[option] = true;
    }
  },
  computed: {
    isLoggedIn() {
      return true;
    },
    isDisabled() {
      return disable.value;
    },
    showModal() {
      if (displayPost.value == false) {
        return disable.value;
      }
      else {
        return false;
      }
    },
    postLoaded() {
      console.log(active.value[1])
      if (active.value[1] == true) {
        if (displayPost.value == true) {
          return true;
        }
        return false;
      }
      else {
        return false;
      }
    },
  },
  mounted() {
    this.getNewsData();
    this.getPostData();
  }
})
</script>


<style scoped>

.item-header {
  position: relative;
  top: .25rem;
  text-align: center;
}

#header {
  height: 5%;
}

.modalContent {
}

#subheader {
  padding-top: .5rem;
  padding-bottom: .5rem;
}
.header {
  position: relative;
  padding: .25rem;
}

#toolbar {
  width: 100%;
  height: 4rem;
}

#menu {
  height: 100%;
  width: 8%;
}

#modal {
  position: relative;
  bottom: 7%
}

.fab {
  transform: translateY(-100%);
  position: fixed;
}

.tab {
  height: 2rem;
  width: 2rem;
}

.card {
  width: 100%;
  mask-image: linear-gradient(#ffffff 10%, transparent 95%);
}

.page {
  transform: translateY(-130%);
  height: 3rem;
  width: 95%;
  height: 50%;
  position: absolute;
}

.input {
  transform: translateX(5%);
  margin-bottom: 1rem;
  width: 90%;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

#date {
  position: relative;
  top: 2%;
  left: 5%;
}

#next {
  position: absolute;
  bottom: 0rem;
  right: 0rem;
}

#back {
  position: absolute;
  bottom: 0rem;
  left: 0rem;
}

</style>
