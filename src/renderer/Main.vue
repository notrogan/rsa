<template>
  <ion-menu content-id="main">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
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
      <ion-buttons slot="start">
        <ion-menu-button id="menuButtonWrapper">
          <ion-icon id="menuButton" :icon="menu"/>  
        </ion-menu-button>
      </ion-buttons>
    </ion-header>

    <ion-content class="ion-padding"> 
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
        <div v-for="data in serverPostData" :key="data.id">
          <ion-card :disabled="isDisabled" @click="onViewPost(data.id)">
            <img class="card" alt="card image" :src="`https://conferencereports.s3.amazonaws.com/assets/rsa/${data.image.toLowerCase()}.png`"/>
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
      
      <p v-if="active[2] == true">
        <ion-label class="menuHeader">Listed Jobs</ion-label>
        <ion-list lines="full">
          <div v-for="data in serverPostedData">
            <ion-item>
              <ion-label> {{ data.title }} ({{ data.date.substring(0, 10) }})</ion-label>
            </ion-item>
          </div>
          <p v-if="serverPostedData.length == 0">
            <ion-item>
              <ion-label>You don't have any job listings!</ion-label>
            </ion-item>
          </p>
        </ion-list>
        <ion-label class="menuHeader">Accepted Jobs</ion-label>
        <ion-list lines="full">
          <div v-for="data in serverAcceptedData">
            <ion-item>
              <ion-label> {{ data.title }} ({{ data.date.substring(0, 10) }})</ion-label>
            </ion-item>
          </div>
          <p v-if="serverAcceptedData.length == 0">
            <ion-item>
              <ion-label>You don't have any accepted listings!</ion-label>
            </ion-item>
          </p>
        </ion-list>
      </p>

      <p v-if="active[3] == true">
        <ion-label class="menuHeader">Nothing here yet!</ion-label>
        <ion-list lines="full">
          <ion-item>
            <ion-label>Check again in a future update.</ion-label>
          </ion-item>
        </ion-list>
      </p>
    </ion-content>
    
    <Transition name="slide">
      <p v-if="showModal">
        <ion-card class="page">
          <ion-progress-bar type="indeterminate"></ion-progress-bar>
          <p v-if="modal == 0">
            <div id="date">
              <ion-datetime v-model.lazy="input.date" fill="outline"></ion-datetime>
            </div>
          </p>
          <p v-if="modal == 1">
            <div>
                <h1 class="modal-header">Job Details</h1>
            </div>
            <ion-select v-model.lazy="input.image" class="input" fill="outline" interface="action-sheet" placeholder="Category">
              <div v-for="job in jobs">
                <ion-select-option :value="`${job}`">{{ job }}</ion-select-option>
              </div> 
            </ion-select>

            <ion-input v-model.lazy="input.title" class="input" label="Title" label-placement="floating" fill="outline" placeholder="Enter text"></ion-input>

            <ion-input v-model.lazy="input.content" class="input" label="Description" label-placement="floating" fill="outline" placeholder="Enter text"></ion-input>

            <ion-input v-model.lazy="input.location" class="input" label="Location" label-placement="floating" fill="outline" placeholder="Enter text"></ion-input>

            <ion-input v-model.lazy="input.user" class="input" label="Name" label-placement="floating" fill="outline" placeholder="Enter text"></ion-input>
            
          </p>
          <p v-if="modal != 1">
            <ion-button id="next" fill="clear"  @click="onClickModal(true)">Next</ion-button>
          </p>
          <p v-if="modal == 1">
            <ion-button id="next" fill="clear"  @click="onClickSubmit()">Submit</ion-button>
          </p>
          <p v-if="modal != 0">
            <ion-button id="back" fill="clear"  @click="onClickModal(false)">Back</ion-button>
          </p>
        </ion-card>
      </p>
    </Transition>

    <Transition name="slide">
      <p v-if="postLoaded">
        <ion-card class="page">
          <div class="header">
            <ion-label color="dark">
              <div id="labelHeader">
                <h1 class="item-header">{{ currentPostData.title }}</h1>
              </div>
              <ion-list>
                <ion-item>
                  <ion-icon aria-hidden="true" :icon="person" slot="start"></ion-icon>
                  <ion-label class="item-label">{{ currentPostData.user }}</ion-label>
                </ion-item>
                <ion-item> 
                  <ion-icon aria-hidden="true" :icon="location" slot="start"></ion-icon>
                  <ion-label class="item-label">{{ currentPostData.location }}</ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon aria-hidden="true" :icon="calendar" slot="start"></ion-icon>
                  <ion-label class="item-label">{{ currentPostData.date }}</ion-label>
                </ion-item>
              </ion-list> 
              
            </ion-label> 
            <div id="labelWrapper">
              <ion-label id="labelContent" class="modalContent">
                {{ currentPostData.content }} 
              </ion-label>
            </div>
          </div>
          <ion-button id="buttonWrapper" @click="onAcceptJob()">accept job</ion-button>
          <ion-toast color="light" id="toast" trigger="buttonWrapper" message="Job Accepted Sucessfully" :duration="2000"></ion-toast>
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
import { toastController, useIonRouter } from '@ionic/vue'
import { newspaper, newspaperOutline, home, homeOutline, person, personOutline, settings, settingsOutline, menu, menuOutline, chatboxOutline, chatboxEllipsesOutline, add, document, colorPalette, globe, locationOutline, location, calendar, build } from 'ionicons/icons';
import { IonPage, IonContent, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons, IonMenu, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFab, IonFabButton, IonFabList, IonList, IonItem, IonFooter, IonInput, IonSelect, IonSelectOption, IonProgressBar, IonButton, IonDatetime, IonMenuToggle, IonToast } from '@ionic/vue';
import { DataService } from "@/services/DataService";
const dataService = DataService.getInstance();

import { generateShortUUID } from "@/services/Utils";

const controller = new AbortController();
const signal = controller.signal;

let states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
let jobs = ['Garden', 'Music', 'Woodwork', 'Masonry', 'Painting']
let active = ref([true, false, false, false])
let displayPost = ref(false);
let modal = ref(0)
let disable = ref(false)

let postValidate: string[] = ['docType', 'id', 'user', 'location', 'date', 'title', 'content', 'image'];

let buttonStatus = ref(false);

const uuid = null

const input = ref({
    docType: "POST",
    id: generateShortUUID(),
    user: '',
    location: '',
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
    title: '',
    content: '',
    image: '',
    from: '',
    to: ''
})

function stall(func: () => void, ms: number | undefined) {
  return new Promise(() => {
      setTimeout(func, ms)
  })
}

export default defineComponent({
  name: "AppHeader",
  components: { IonPage, IonContent, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons, IonMenu, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFab, IonFabButton, IonFabList, IonList, IonItem, IonFooter, IonInput, IonSelect, IonSelectOption, IonProgressBar, IonButton, IonDatetime, IonMenuToggle, IonToast, toastController },
  data() {
    return { 
      currentPostData: {} as Record<string, any>,
      serverNewsData: [] as any[],
      serverPostData: [] as any[],
      serverPostedData: [] as any[],
      serverAcceptedData: [] as any[],
      newspaper, newspaperOutline, home, homeOutline, person, personOutline, settings, settingsOutline, menu, menuOutline, chatboxOutline, chatboxEllipsesOutline, add, document, colorPalette, globe, active, modal, states, displayPost, buttonStatus, locationOutline, location, calendar, build, jobs, input
    };
  },
  setup() {
    const ionRouter = useIonRouter();
  },
  methods: {
    async getNewsData() : Promise<Record<string, any>[]> {
      // const response = await fetch('src/assets/testData.json');
      // const response = await fetch(new URL(API_URL + '/dev/posts'));
      // const all_data = await response.json();
      // console.debug("Data from API: ", all_data);
      // const data = all_data.filter( (doc:any) => { return doc.docType == 'NEWS'});
      const data = await dataService.getData("NEWS");
      console.debug("News data from API: ", data);
      this.serverNewsData = data;
      return data;
    },
    async getPostedData() : Promise<Record<string, any>[]> {
      this.serverPostedData = [];
      const data = await dataService.getData("POST");
      for (var i = 0; i < data.length; i++) {
        this.fetchUUID();
        const uuid = localStorage.getItem("uuid");
        if (data[i]['from'] == uuid) {
          console.log("found")
          this.serverPostedData.push(data[i]);
        }
      }
      return data;
    },
    async getAcceptedData() : Promise<Record<string, any>[]> {
      this.serverAcceptedData = [];
      const data = await dataService.getData("POST");
      for (var i = 0; i < data.length; i++) {
        this.fetchUUID();
        const uuid = localStorage.getItem("uuid");
        if (data[i]['to'] == uuid) {
          console.log("found")
          this.serverAcceptedData.push(data[i]);
        }
      }
      return data;
    },
    async getPostData() : Promise<Record<string, any>[]> {
      const data = await dataService.getData("POST");
      console.debug("Posts data from API: ", data);

      this.serverPostData = data.sort(function(a,b){
        return (new Date(b.date).getTime() - new Date(a.date).getTime())
      });

      return data;
    },
    async presentToast(variant: string) {
        const toast = await toastController.create({
          color: 'light',
          message: variant,
          duration: 2000,
          position: 'bottom',
          cssClass: 'toast'
        });

        await toast.present();
      },
    getPostDataForIndex(index: string) {
      disable.value = !disable.value;
      const data = this.serverPostData.filter( (d) => { return d.id == index} )[0];
      this.currentPostData = data;
    },
    onChangePage(page: number) {
      active.value = [false, false, false, false];
      active.value[page] = true;
    },
    onClickModal(direction: boolean) {
      if (direction == true) {
        if (modal.value < 1) {
          modal.value ++;
        }
      }
      else if (modal.value > 0) {
        modal.value --;
      }
    },
    onCreatePost() {
      modal.value = 0;
      stall(() => {buttonStatus.value = false}, 1)
      displayPost.value = false;
      disable.value = !disable.value;
    },
    onViewPost(post: string) {
      this.getPostDataForIndex(post);
      buttonStatus.value = true;
      disable.value = true;
      displayPost.value = true;
    },
    onClickSidebar(option: number) {
      console.log(option);
      active.value = [false, false, false, false];
      active.value[option] = true;
    },
    onAcceptJob() {
      stall(() => {buttonStatus.value = false}, 1)
      displayPost.value = false;
      disable.value = false;
      console.log("job");

      
      let output = {...this.currentPostData};
      output = this.appendUUIDto(output);
      console.log("onAcceptJob: ", output);

      dataService.postData(output);

      this.getPostedData();
      this.getAcceptedData();
    },
    onClickSubmit() {
      console.log("submit");
      console.log(input.value);

      var validated = 0;

      // for (var i = 0; i < postValidate.length; i++) {
      //   if (input.value[postValidate[i]] != '') {
      //     validated ++;
      //   }
      // }

      postValidate.forEach( (k: string) => {
        const inputObj: Record<string, any> = input.value;
        if (inputObj[k] != '') {
          validated ++;
        }
      })

      console.log(validated);

      if (validated == 8) {
        this.appendUUID();
        dataService.postData(input.value);
        this.presentToast('Post Created Succesfully');
      }
      else {
        this.presentToast('Missing Required Fields');
      }

      this.getPostedData();
      this.getAcceptedData();
    },
    appendUUID() {
      this.fetchUUID();
      const uuid = localStorage.getItem("uuid");
      if (uuid) {
        input.value['from'] = uuid.toString();
      }
    },
    appendUUIDto(data: Record<string, any>) {
      this.fetchUUID();
      const userId = localStorage.getItem("uuid") || "";
      data.to = userId.toString();
      // console.debug("appendUUIDTo: ", output);
      return data;
    },
    fetchUUID() {
      if (localStorage.getItem("uuid") == null) {
        localStorage.setItem("uuid", generateShortUUID());
      }
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
    this.fetchUUID();
    this.getPostedData();
    this.getAcceptedData();
  }
})
</script>


<style scoped>

#toast {
  text-align: center;
}

#disclaimerWrapper {
  text-align: center;
}

.disclaimer {
  position: relative;
  text-align: center;
}

.item-header {
  position: relative;
  top: .25rem;
  text-align: center;
}

.modal-header {
  position: relative;
  text-align: center;
}

#header {
  height: 5%;
}


#menuButtonWrapper {
  opacity: 1;
  /* border: 1px solid red; */
}

#menuButton {
  opacity: 1;
  /* border: 1px solid red; */
}

#buttonWrapper {
  width: 70%;
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
}

#labelWrapper {
  padding-top: .5rem;
  margin: auto;
  width: 95%;
}

#labelContent {
  font-size: 1rem;
}

#labelHeader {
  width: 95%;
  margin: auto;
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

.toggle {
  border: 1px solid red;
}

.menuHeader {
  font-size: 1.25rem;
}

</style>
