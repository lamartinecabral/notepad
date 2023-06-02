// @ts-check

const IdEnum = {
  /** @type {'app'} */ app: "app",
  /** @type {'status'} */ status: "status",
  /** @type {'header'} */ header: "header",
  /** @type {'theme'} */ theme: "theme",
  /** @type {'password'} */ password: "password",
  /** @type {'options'} */ options: "options",
  /** @type {'github'} */ github: "github",
  /** @type {'footer'} */ footer: "footer",
  /** @type {'markdown'} */ markdown: "markdown",
  /** @type {'backdrop'} */ backdrop: "backdrop",
  /** @type {'modal'} */ modal: "modal",
  /** @type {'optionsModal'} */ optionsModal: "optionsModal",
  /** @type {'protected'} */ protected: "protected",
  /** @type {'public'} */ public: "public",
  /** @type {'logout'} */ logout: "logout",
  /** @type {'passwordModal'} */ passwordModal: "passwordModal",
  /** @type {'form'} */ form: "form",
  /** @type {'emailInput'} */ emailInput: "emailInput",
  /** @type {'passwordInput'} */ passwordInput: "passwordInput",
  /** @type {'textarea'} */ textarea: "textarea",
  /** @type {'claim'} */ claim: "claim",
};

/** @enum {keyof typeof IdEnum} */
export const Id = IdEnum;
