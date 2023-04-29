const home = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This is the home route',
  });
};

export default home;
