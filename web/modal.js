var Modal = {
	/** @returns {Promise<string>} */
	password: function () {
		return new Promise((resolve, reject) => {
			let div = Modal.backdrop(resolve, reject);
			document.body.insertBefore(div, document.getElementById("textarea"));
			let div2 = Modal.whitebox(resolve, reject);
			div.append(div2);

			/** @type {HTMLFormElement} */
			let form = document.createElement("form");
			form.addEventListener("submit", (ev) => {
				ev.preventDefault();
				div.remove();
				resolve(ev.target[0].value);
			});
			div2.append(form);

			let label = document.createElement("label");
			label.innerHTML = "Password: ";
			label.htmlFor = "pwd";
			form.append(label);

			/** @type {HTMLInputElement} */
			let input = document.createElement("input");
			input.type = "password";
			input.name = "pwd";
			setTimeout((i) => i.select(), 0, input);
			form.append(input);

			/** @type {HTMLInputElement} */
			let send = document.createElement("input");
			send.type = "submit";
			Object.assign(send.style, { "font-family": "monospace" });
			form.append(send);
		});
	},

	/** @returns {Promise<string>} */
	options: function () {
		return new Promise((resolve, reject) => {
			let intervalId = 0;
			let div = Modal.backdrop(resolve, (msg) => {
				clearInterval(intervalId);
				reject(msg);
			});
			document.body.insertBefore(div, document.getElementById("github"));
			let div2 = Modal.whitebox(resolve, reject);
			div.append(div2);

			let protect = document.createElement("div");
			div2.append(protect);

			/** @type {HTMLInputElement} */
			let input1 = document.createElement("input"); /*  as HTMLInputElement */
			input1.type = "checkbox";
			input1.name = "protect";
			input1.addEventListener("change", () => {
				Modal.Action.protect();
			});
			protect.append(input1);

			let label1 = document.createElement("label");
			label1.innerHTML = "Protected";
			label1.htmlFor = "protect";
			protect.append(label1);

			let public = document.createElement("div");
			div2.append(public);
			Object.assign(public.style, { margin: "0.5em 0 1em 0" });

			/** @type {HTMLInputElement} */
			let input2 = document.createElement("input");
			input2.type = "checkbox";
			input2.name = "public";
			input2.addEventListener("change", () => {
				Modal.Action.public();
			});
			public.append(input2);

			let label2 = document.createElement("label");
			label2.innerHTML = "Public";
			label2.htmlFor = "public";
			public.append(label2);

			let logout = document.createElement("div");
			div2.append(logout);
			Object.assign(logout.style, {
				"margin-top": "1em",
				"text-align": "center",
			});

			/** @type {HTMLButtonElement} */
			let button = document.createElement("button");
			button.innerText = "Logout";
			Object.assign(button.style, { "font-family": "monospace" });
			button.addEventListener("click", () => {
				clearInterval(intervalId);
				Server.logout();
				div.remove();
			});
			logout.append(button);

			let prot, publ;
			intervalId = setInterval(() => {
				if (prot === State.obj.protected && publ === State.obj.public) return;
				prot = State.obj.protected;
				publ = State.obj.public;
				if (State.obj.protected) {
					input1.checked = true;
					input2.disabled = false;
				} else {
					input1.checked = false;
					input2.disabled = true;
				}
				if (State.obj.public) {
					input2.checked = true;
				} else {
					input2.checked = false;
				}
			}, 100);
		});
	},

	backdrop: function (resolve, reject) {
		/** @type {HTMLDivElement} */
		let div = document.createElement("div");
		Object.assign(div.style, {
			position: "fixed",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			background: "#0009",
			"z-index": 1,
		});
		div.addEventListener("click", () => {
			div.remove();
			reject("backdrop click");
		});
		let eventListener = (ev) => {
			if (ev.key === "Escape" || ev.code === "Escape" || ev.keyCode === 27) {
				reject("esc pressed");
				div.remove();
				document.removeEventListener("keyup", eventListener);
			}
		};
		document.addEventListener("keyup", eventListener);
		return div;
	},

	whitebox: function (resolve, reject) {
		/** @type {HTMLDivElement} */
		let div2 = document.createElement("div");
		Object.assign(div2.style, {
			background: "var(--background)",
			padding: "2em",
			position: "absolute",
			bottom: "50%",
			right: "50%",
			transform: "translate(50%, 50%)",
			color: "var(--color)",
			border: "1px solid var(--color)",
		});
		div2.addEventListener("click", (ev) => {
			ev.stopPropagation();
		});
		return div2;
	},

	Action: {
		protect: function () {
			if (State.obj.protected) Server.unprotect();
			else Server.protect();
		},

		public: function () {
			if (State.obj.public) Server.unpublic();
			else Server.public();
		},
	},
};
