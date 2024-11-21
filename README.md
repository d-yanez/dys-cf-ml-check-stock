# Proyecto: Cloud Function para Verificar Stock de Mercado Libre

## Descripción

Este proyecto es una **Cloud Function** construida con **Node.js** que expone una ruta para verificar el stock de productos en **Mercado Libre**. La función se activa mediante una solicitud HTTP **POST** y se encarga de procesar órdenes de compra, verificando el stock de los productos e interactuando con la API de **Meta (WhatsApp)** para enviar notificaciones de "stock out" cuando un SKU no tiene stock disponible.

### Características:
- Valida la presencia de una **API Key** en los headers.
- Procesa órdenes de compra recibidas desde la API de Mercado Libre.
- Verifica el stock de cada SKU de la orden.
- Envía notificaciones a WhatsApp mediante la API de Meta cuando no hay stock.

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org) (versión 18 o superior)
- [MongoDB](https://www.mongodb.com/) (o acceso a una base de datos MongoDB)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (si vas a desplegar la Cloud Function)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) o [npm](https://www.npmjs.com/)

### Dependencias

Las principales dependencias del proyecto son:
- **Express**: Framework para manejar las rutas HTTP.
- **Mongoose**: Para la interacción con MongoDB.
- **Axios**: Cliente HTTP para realizar solicitudes a las APIs de Mercado Libre y Meta.
- **@google-cloud/functions-framework**: Para ejecutar la Cloud Function localmente.

## Instalación


## Clonar el repositorio

```
git clone https://github.com/d-yanez/dys-cf-ml-check-stock.git
```

## deploy
```
gcloud functions deploy dys-cf-ml-check-stock \
--runtime nodejs18 \
--trigger-http \
--allow-unauthenticated \
--region=us-central1 \
--env-vars-file=.env.yaml \
--entry-point=app
```




