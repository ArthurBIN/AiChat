<template>
  <div class="All">
<!--    <van-button type="primary" @click="fetchData">主要按钮</van-button>-->
  </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from "uuid";

export default {
  name: "VoiceDemo",
  data() {
    return {
      audioUrl: null,
      secretId: 'AKIDJZjgvxsbCaml6Nes3JYs4A9ujQvCG6zo',
      secretKey: 'w2vqiYClHckhihW80pSvpfO0jRYedZP4',
    };
  },
  methods: {
    async fetchData() {
      const service = 'tts';
      const host = 'tts.tencentcloudapi.com';
      const region = 'ap-beijing';
      const action = 'TextToVoice';
      const version = '2019-08-23';
      const algorithm = 'TC3-HMAC-SHA256';
      const timestamp = Math.floor(Date.now() / 1000);
      const date = new Date(timestamp * 1000).toISOString().substr(0, 10);
      const uuid = uuidv4();
      const requestPayload = {
        Text: '你好',
        SessionId: uuid,
        Volume: 1,
        ProjectId: 0,
        ModelType: 1,
        VoiceType: 0,
        PrimaryLanguage: 1,
      };
      const payloadHash = CryptoJS.SHA256(JSON.stringify(requestPayload)).toString();

      const canonicalHeaders = `content-type:application/json\nhost:${host}\n`;
      const signedHeaders = 'content-type;host';
      const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

      const credentialScope = `${date}/${service}/tc3_request`;
      const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${CryptoJS.SHA256(canonicalRequest).toString()}`;

      const kDate = CryptoJS.HmacSHA256(date, 'TC3' + this.secretKey);
      const kService = CryptoJS.HmacSHA256(service, kDate);
      const kSigning = CryptoJS.HmacSHA256('tc3_request', kService);
      const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString();

      const authorization = `${algorithm} Credential=${this.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
      console.log(authorization)
      axios.post(`/api`, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'X-TC-Action': action,
          'X-TC-Version': version,
          'X-TC-Timestamp': timestamp,
          'X-TC-Region': region,
          'Authorization': authorization,
        },
      })
          .then(response => {
            console.log(response.data.Response);

            const audioBase64 = response.data.Response.Audio;
            this.audioUrl = `data:audio/wav;base64,${audioBase64}`;

            const audio = new Audio(this.audioUrl);
            audio.play();

            audio.onended = () => {
              this.audioUrl = null;
            };
          })
          .catch(error => {
            console.error('Error synthesizing voice:', error);
          });
    }
  }
}
</script>

<style scoped>
</style>
