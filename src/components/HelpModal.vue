<template>
  <div id="help-modal" class="modal active" v-show="visible">
    <a href="#" class="modal-overlay" aria-label="Close" @click="close()" />
    <div class="modal-container">
      <div class="modal-header">
        <a href="#" class="btn btn-clear float-right" aria-label="Close" @click="close()" />
        <div class="modal-title h4">
          Help, Tips & Tricks, FAQ
        </div>
      </div>
      <div class="modal-body">
        <div class="content">
          <h5>Basic Usage</h5>
          <hr/>
          <p>Paste a list of cards into the input box and hit <i>Submit</i>. Most deck builder export formats should be supported, but if you find something that doesn't work let me know on either of the Twitter or Github links at the top of the desktop site.</p>
          <p>Once your list is loaded, you can adjust set selections using the dropdowns below each card.</p>
          <p>Either click the <i>Print</i> button on the page or use your browser's Print menus to complete the process.</p>

          <h5>Exact Matches</h5>
          <hr/>
          <p>By default the first alphabetical printing of a card is used?</p>
          <p>If you would like to specify the printing enable <b>Match Input Editions</b> in the configuration and use DigimonCard.io decklist syntax (ex. <kbd>Agumon BT1-010</kbd>).</p>

          <h5>Print Formatting</h5>
          <hr/>
          <p><b>Paper Size:</b> Use your browser's print dialog to configure options such as the paper size and printer destination. Saving as a PDF is listed as a printer selection in all modern browsers.</p>
          <p><b>Margins:</b> I recommend <b>not</b> adjusting the margins on the page, but wish you the best of luck if you opt to.</p>

          <h5>Build Details</h5>
          <hr/>
          <ul>
            <li>Repository: <a href="https://github.com/haganbmj/digi-proxy-site" target="_blank">github.com/haganbmj/digi-proxy-site</a></li>
            <li>Build SHA: <a :href="'https://github.com/haganbmj/digi-proxy-site/commit/' + getBuildSha()" target="_blank">{{ getBuildSha() }}</a></li>
            <li>Timestamp: {{ getBuildTimestamp() }}</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#" class="btn btn-link" aria-label="Close" @click="close()">Close</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
        }
    },
    emits: [
        'show',
        'close',
    ],
    methods: {
        show() {
            this.visible = true;
            this.$emit('show');
        },
        close() {
            this.visible = false;
            this.$emit('close');
        },
        getBuildTimestamp() {
            return import.meta.env.VITE_BUILD_TIMESTAMP;
        },
        getBuildSha() {
            return import.meta.env.VITE_BUILD_SHA || 'local';
        },
    },
}
</script>
