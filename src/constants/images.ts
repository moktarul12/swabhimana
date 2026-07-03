import { ImageSourcePropType } from 'react-native';

export const LOCAL_IMAGES = {
  logoMark: require('../../assets/images/logo-mark.png'),
  splashChildren: require('../../assets/images/splash-children.jpg'),
  homeFamily: require('../../assets/images/home-family.jpg'),
  onboardingDonation: require('../../assets/images/onboarding-donation.jpg'),
  avatarAnkit: require('../../assets/images/avatar-ankit.jpg'),
  programFood: require('../../assets/images/program-food.jpg'),
  programClothing: require('../../assets/images/program-clothing.jpg'),
  programEducation: require('../../assets/images/program-education.jpg'),
  programHealth: require('../../assets/images/program-health.jpg'),
  donationClothes: require('../../assets/images/donation-clothes.jpg'),
  donationBooks: require('../../assets/images/donation-books.jpg'),
  donationFood: require('../../assets/images/donation-food.jpg'),
  donationToys: require('../../assets/images/donation-toys.jpg'),
  collectedPhoto: require('../../assets/images/collected-photo.jpg'),
  deliveryPhoto: require('../../assets/images/delivery-photo.jpg'),
  storyClothes: require('../../assets/images/story-clothes.jpg'),
  storyFood: require('../../assets/images/story-food.jpg'),
  storyBooks: require('../../assets/images/story-books.jpg'),
} as const;

export type ImageKey = keyof typeof LOCAL_IMAGES;

const KEY_ALIASES: Record<string, ImageKey> = {
  'splash-children': 'splashChildren',
  'home-family': 'homeFamily',
  'onboarding-donation': 'onboardingDonation',
  'avatar-ankit': 'avatarAnkit',
  'donation-clothes': 'donationClothes',
  'donation-books': 'donationBooks',
  'donation-food': 'donationFood',
  'donation-toys': 'donationToys',
  'collected-photo': 'collectedPhoto',
  'delivery-photo': 'deliveryPhoto',
  'story-clothes': 'storyClothes',
  'story-food': 'storyFood',
  'story-books': 'storyBooks',
};

export function resolveImage(source: string | null | undefined): ImageSourcePropType {
  if (!source) return LOCAL_IMAGES.donationClothes;
  if (source.startsWith('http') || source.startsWith('file:') || source.startsWith('data:')) {
    return { uri: source };
  }
  const key = (KEY_ALIASES[source] || source) as ImageKey;
  return LOCAL_IMAGES[key] ?? LOCAL_IMAGES.donationClothes;
}
