export const getDeviceValues = ({
  detail,
}: {
  detail: any;
}): {
  device: any;
  medium: string;
} => {
  const { device, medium = '' } = detail || {};
  return {
    device,
    medium,
  };
};
