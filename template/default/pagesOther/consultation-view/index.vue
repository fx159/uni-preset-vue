<template>
	<web-view :src="path"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				path: ''
			}
		},
		onLoad(opt) {
            this.path = `https://t-ilawpush5.aegis-info.com/iLitigationRisk/question?subjectId=${opt.subjectId}&from=mini`
            console.log(this.path)
        }
	}
</script>
