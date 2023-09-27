// listen for a serverside event

import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useNotificationsStore} from "../notifications.ts";

const BASE_URL = import.meta.env.VITE_API_URL as string;

// const BASE_URL = 'http://35.179.94.88/api';
// const BASE_URL = 'http://192.168.1.7:5000/api';

export const useChatbotStore = defineStore('chatbot', () => {

    // state

    // create the variables to store the connection and the stream

    const stringArray = ref<string[]>([]);
    const oldString = ref<string>('');
    const newString = ref<string>('');
    const responseString = ref<string>('');

    // getters

    const getChatbot = computed(() => {
        return stringArray.value.join('');
    });
    const getOldString = computed(() => {
        return oldString.value;
    });
    const getNewString = computed(() => {
        return newString.value;
    });
    const getLastString = computed(() => {
        return stringArray.value[stringArray.value.length - 1];
    });

    // actions

    async function establishConnection(pageId: string, userQuery: string) {
        console.log('establishConnection', pageId);

        const notificationsStore = useNotificationsStore();

        try {

            const response = await fetch(`${BASE_URL}/openai/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pageId,
                    userQuery,
                }),
            });

            const reader = response.body?.getReader();

            // handle the streamable response
            const stream = new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({done, value}) => {
                            // Is there no more data to read?
                            if (done) {
                                // Tell the browser that we have finished sending data
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            push();
                        });
                    }

                    push();
                }
            });

            // Respond with our stream
            return new Response(stream, {headers: {"Content-Type": "text/html"}});

            // create a new reader
            // const reader2 = responseStream.body.getReader();
            //
            // // read the stream
            // const result = await reader2.read();
            //
            // // convert the stream to a string
            // const decoder = new TextDecoder();
            //
            // // push the result to the string array
            // stringArray.value.push(decoder.decode(result.value));
            //
            // // listen for new data
            // reader2.read().then(function processText({done, value}) {
            //     // Result objects contain two properties:
            //     // done  - true if the stream has already given you all its data.
            //     // value - some data. Always undefined when done is true.
            //     if (done) {
            //         console.log("Stream complete");
            //         return;
            //     }
            //     // value for fetch streams is a Uint8Array
            //     console.log("Received", decoder.decode(value));
            //     responseString.value = decoder.decode(value);
            //     stringArray.value.push(decoder.decode(value));
            //     // Read some more, and call this function again
            //     return reader2.read().then(processText);
            // });
            //
            // return stringArray.value.join('');
        } catch (e) {
            console.error(e);

            notificationStore.addNotification('An error occurred while fetching the chatbot response', 'error');

            throw e;
        }
    }

    return {
        stringArray,
        responseString,
        oldString,
        newString,
        getChatbot,
        getOldString,
        getNewString,
        getLastString,
        establishConnection,
    }
})
