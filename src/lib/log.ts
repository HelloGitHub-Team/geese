const info = (data: any) => {
  console.log(data);
};

const error = (data: any) => {
  console.error(data);
};

const result = {
  info,
  error,
};

export default result;
