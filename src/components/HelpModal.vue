<template>
    <div id="help-modal" class="modal active" v-show="visible">
        <a href="#" class="modal-overlay" aria-label="Close" @click="close()"></a>
        <div class="modal-container">
            <div class="modal-header">
                <a href="#" class="btn btn-clear float-right" aria-label="Close" @click="close()"></a>
                <div class="modal-title h4">Help, Tips & Tricks, FAQ</div>
            </div>
            <div class="modal-body">
                <div class="content">
                    <h5>Basic Usage</h5>
                    <p>Paste a list of cards into the input box and hit <i>Submit</i>.</p>
                    <p>Once your list is loaded, you can adjust set selections using the dropdowns below each card.</p>
                    <p>Either click the <i>Print</i> button on the page or use your browser's Print menus to complete the process.</p>

                    <h5>Print Formatting</h5>
                    <p><b>Paper Size:</b> Use your browser's print dialog to configure options such as the paper size and printer destination. Saving as a PDF is listed as a printer selection in all modern browsers.</p>
                    <p><b>Margins:</b> I recommend <b>not</b> adjusting the margins on the page, but wish you the best of luck if you opt to.</p>

                    <h5>Build Details</h5>
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
            return document.documentElement.dataset.buildTimestamp;
        },
        getBuildSha() {
            return document.documentElement.dataset.buildSha || 'local';
        },
    }
}
</script>
