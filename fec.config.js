module.exports =
  process.env.IOP === 'true'
    ? require('./config/fec.iop')
    : require('./config/fec.hcc');
