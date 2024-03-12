// place files you want to import through the `$lib` alias in this folder.
export function loadScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;

		document.body.appendChild(script);

		script.addEventListener('load', () => resolve(script));
		script.addEventListener('error', () => reject(script));
	});
}
