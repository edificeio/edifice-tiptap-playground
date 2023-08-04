# Edifice Tiptap Playground

Playground app to develop and test Titap Editor and extensions/components.

## Frontend development

Please see [frontend/README.md](./frontend/README.md) for frontend development instructions

## Deployment

This app is deployed to https://recette-ode1.opendigitaleducation.com/tiptap

To deploy the app, you need to build and copy dist files to recette-ode1 webs server.

Please follow the following instructions:

```
cd frontend
pnpm build
scp -r dist/* recette-ode1-web1.ipa.ode.tools:/tmp
scp -r dist/* recette-ode1-web2.ipa.ode.tools:/tmp
```

```
ssh recette-ode1-web1.ipa.ode.tools
sudo cp /tmp/index.html /var/www/web-education/static/tiptap/
sudo cp -r /tmp/public/ /var/www/web-education/static/tiptap/
```

```
ssh recette-ode1-web2.ipa.ode.tools
sudo cp /tmp/index.html /var/www/web-education/static/tiptap/
sudo cp -r /tmp/public/ /var/www/web-education/static/tiptap/
```
