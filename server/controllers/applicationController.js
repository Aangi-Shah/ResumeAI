const Application = require('../models/Application');


// Get All Applications

exports.getApplications = async (
  req,
  res
) => {

  try {

    const applications =
      await Application.find({
        userId: req.userData.userId
      }).sort({
        createdAt: -1
      });

    res.json(applications);

  } catch (error) {

    res.status(500).json({
      message: 'Server error'
    });
  }
};


// Create Application

exports.createApplication = async (
  req,
  res
) => {

  try {

    const application =
      new Application({
        ...req.body,
        userId: req.userData.userId
      });

    await application.save();

    res.status(201).json(
      application
    );

  } catch (error) {

    res.status(500).json({
      message: 'Server error'
    });
  }
};


// Update Application

exports.updateApplication = async (
  req,
  res
) => {

  try {

    const application =
      await Application.findOneAndUpdate(

        {
          _id: req.params.id,
          userId: req.userData.userId
        },

        req.body,

        {
          new: true
        }
      );

    if (!application) {

      return res.status(404).json({
        message: 'Application not found'
      });
    }

    res.json(application);

  } catch (error) {

    res.status(500).json({
      message: 'Server error'
    });
  }
};


// Delete Application

exports.deleteApplication = async (
  req,
  res
) => {

  try {

    const application =
      await Application.findOneAndDelete({

        _id: req.params.id,
        userId: req.userData.userId
      });

    if (!application) {

      return res.status(404).json({
        message: 'Application not found'
      });
    }

    res.json({
      message: 'Application deleted successfully'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error'
    });
  }
};


// Dashboard Stats

exports.getStats = async (
  req,
  res
) => {

  try {

    const userId =
      req.userData.userId;

    const applications =
      await Application.find({
        userId
      });

    const total =
      applications.length;

    const interviews =
      applications.filter(app =>
        [
          'Interview Scheduled',
          'Interview Done'
        ].includes(app.status)
      ).length;

    const rejections =
      applications.filter(app =>
        app.status === 'Rejected'
      ).length;

    const offers =
      applications.filter(app =>
        app.status === 'Offer Received'
      ).length;

    const pending =
      applications.filter(app =>
        app.status === 'Applied'
      ).length;

    const highPriority =
      applications.filter(app =>
        app.priority === 'High'
      ).length;

    const successRate =
      total
        ? (
            (offers / total) * 100
          ).toFixed(1)
        : 0;

    res.json({

      total,

      interviews,

      offers,

      pending,

      highPriority,

      interviewRate:
        total
          ? (
              (interviews / total) * 100
            ).toFixed(1)
          : 0,

      rejectionRate:
        total
          ? (
              (rejections / total) * 100
            ).toFixed(1)
          : 0,

      successRate,

      applications
    });

  } catch (error) {

    res.status(500).json({
      message: 'Server error'
    });
  }
};