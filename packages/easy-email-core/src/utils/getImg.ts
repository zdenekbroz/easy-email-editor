import { ImageManager } from './ImageManager';

const defaultImagesMap = {
  IMAGE_01:
    'https://easy-email-m-ryan.vercel.app/images/ffddc3db-3aae-4d73-ac9c-e1263641f7b4-03c89c34-49a4-4d45-b289-4d2261158cbe.png',
  IMAGE_02:
    '/images/system/facebook.png',
  IMAGE_03:
    '/images/system/instagram.png',
  IMAGE_04:
    '/images/system/youtube.png',
  IMAGE_59:
    'https://easy-email-m-ryan.vercel.app/images/8e0e07e2-3f84-4426-84c1-2add355c558b-image.png',
  IMAGE_09:
    'https://easy-email-m-ryan.vercel.app/images/be34fb18-32ad-441c-84d8-3c0e9ba9f742-ad2ea5ff-5d0b-446b-bd7d-8e2ab5afdd16.png',
  IMAGE_10:
    'https://easy-email-m-ryan.vercel.app/images/6a1e6292-469e-452a-bbae-44e4b5ff7463-05e543b6-c951-44ce-ae27-ca1282c77f52.png',
  IMAGE_15:
    'https://easy-email-m-ryan.vercel.app/images/f69f48af-5b15-40aa-91c4-81d601d1357b-083dc99d-02a6-40d9-ae28-0662bd078b5d.png',
  IMAGE_16:
    'https://easy-email-m-ryan.vercel.app/images/9cce6b16-5a98-4ddb-b1a1-6cec2cf56891-c3acb856-8ab8-4cfb-93f9-2a0747678b8b.png',
  IMAGE_17:
    'https://easy-email-m-ryan.vercel.app/images/d9795c1d-fa32-4adb-ab25-30b7cfe87936-df21314f-6f05-4550-80b3-9ab1107e8fbe.png',
  IMAGE_31:
    '/images/general/fruit_chocolate_04.jpg',
};

ImageManager.add(defaultImagesMap);
export function getImg(name: keyof typeof defaultImagesMap) {
  return ImageManager.get(name);
}
