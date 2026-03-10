This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

## Auth0 PKCE setup

This extension uses Chrome Identity + Auth0 Authorization Code Flow with PKCE.

### 1) Configure environment variables

Create `.env` with:

```bash
PLASMO_PUBLIC_AUTH0_DOMAIN=your-tenant.us.auth0.com
PLASMO_PUBLIC_AUTH0_CLIENT_ID=your_client_id
PLASMO_PUBLIC_AUTH0_AUDIENCE=
PLASMO_PUBLIC_AUTH0_SCOPE=openid profile email
```

### 2) Configure Auth0 application

In Auth0 Application settings:

- Application Type: SPA or Native
- Token Endpoint Authentication Method: `None`

### 3) Add callback/logout URLs

Use your extension ID in these values:

- Allowed Callback URLs:
  - `https://<EXTENSION_ID>.chromiumapp.org/auth0`
- Allowed Logout URLs:
  - `https://<EXTENSION_ID>.chromiumapp.org/auth0-logout`
- Allowed Web Origins:
  - `chrome-extension://<EXTENSION_ID>`

You can see your extension ID after loading the unpacked extension in Chrome.
