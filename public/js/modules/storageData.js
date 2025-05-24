export function storageData() {
	const dataSlug = this.getAttribute('data-slug');
	const dataId = this.getAttribute('data-id');
	const dataTitle = this.getAttribute('data-title');

	if (dataSlug) localStorage.setItem('slug', dataSlug);
	if (dataId) localStorage.setItem('id', dataId);
	if (dataTitle) localStorage.setItem('title', dataTitle);
}