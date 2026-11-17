# Chlyn’s Fragrance

Landing page for Chlyn’s Fragrance, a perfume boutique in Porto-Novo, Benin.

Live site: https://chlyns-fragrance.netlify.app/

It is plain HTML, CSS and JavaScript with no backend and no build step. Every order button opens WhatsApp with a message already written for the customer, so all orders and questions go straight to the shop’s chat.

## Files

```
index.html       the page
css/style.css    all styles
js/settings.js   WhatsApp number and email
js/main.js       WhatsApp links, scent finder, opening hours, mobile menu
assets/          images and icon
```

## Changing the WhatsApp number or email

Open `js/settings.js` and edit the values:

```js
whatsapp: "22961183934",            // country code + number, digits only
whatsappDisplay: "+229 61 18 39 34", // how it appears on the page
email: "charlineegblea02@gmail.com",
```

Every button on the page picks up the new values. The `href="https://wa.me/..."` written in `index.html` is only a fallback for browsers with JavaScript turned off, so update it there too if the number changes for good.

The message each button sends lives in its `data-wa` attribute in `index.html`. Change the text there to change the message.

## Running it locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000.

## Hosting

All paths are relative, so the site works from any folder or domain.

**GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / root. Pushes to `main` go live in a minute or two.

**Netlify:** drag the folder into Netlify Drop, or connect the repo with no build command and `/` as the publish directory.
