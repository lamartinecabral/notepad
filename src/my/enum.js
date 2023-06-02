// @ts-check

const IdEnum = {
  /** @type {'app'} */ app: "app",
  /** @type {'content'} */ content: "content",
  /** @type {'loginContainer'} */ loginContainer: "loginContainer",
  /** @type {'loginForm'} */ loginForm: "loginForm",
  /** @type {'loginSubmit'} */ loginSubmit: "loginSubmit",
  /** @type {'signinMode'} */ signinMode: "signinMode",
  /** @type {'signupMode'} */ signupMode: "signupMode",
  /** @type {'password2'} */ password2: "password2",
  /** @type {'logout'} */ logout: "logout",
  /** @type {'docList'} */ docList: "docList",
  /** @type {'claimButton'} */ claimButton: "claimButton",
  /** @type {'resetPassword'} */ resetPassword: "resetPassword",
  /** @type {'emptyMessage'} */ message: "emptyMessage",
};

/** @enum {keyof typeof IdEnum} */
export const Id = IdEnum;
