const API_URL = "https://soz88thsmd.execute-api.us-east-1.amazonaws.com";


export class DataService {
  private static instance: DataService;
  // private topics: Record<string, BroadcastChannel>;

  private constructor() {
  }

  public static getInstance = () => {
     if (!DataService.instance) {
      DataService.instance = new DataService();
        console.log("Created a new MessageBusService instance.");
     }
     return DataService.instance;
  }

  public getData = async (docType: string): Promise<Record<string, any>[]> => {
    const response = await fetch(new URL(API_URL + '/dev/posts'), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "cors",
    });
    const all_data = await response.json();
    // console.debug("Data from API: ", all_data);
    const data = all_data.filter( (doc:any) => { return doc.docType == docType});
    // console.debug("news data from API: ", data);

    return (data);
  }

  /*
    Method to post SINGLE Json document to the table.
    Each document should have 2 required attributes:
    * id (unique record identifier)
    * docType: [NEWS, POST]
  */
  public postData = async (data: Record<string, any>) => {
    const response = await fetch(new URL(API_URL + '/dev/posts'), {
      method: "POST",
      // mode: "cors",
      // cache: "no-cache",
      // credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      // redirect: "follow",
      // referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json();  

  }
}