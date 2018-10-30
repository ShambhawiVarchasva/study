const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Statistics = require('../models/statistics');

/*const Pusher = require('pusher');

const keys = require('../config/keys');*/

/*var pusher = new Pusher({
  appId: '623519',
  key: '75eb030b1fa1248eb1b1',
  secret:'b127094512f117a97df4',
  cluster: 'ap2',
  encrypted: true
});*/

router.get('/', (req, res) => {
  Statistics.find({},function(err,votes)
  {
      console.log(votes);
    res.render('statistics',{votes:votes});
  });
});
router.get('/:id', function(req, res){
     
    
          
        let query = {_id:req.params.id}

 
      Statistics.remove(query, function(err){
        if(err){
          console.log(err);
        }
        req.flash('success_msg','Article Deleted');
        
        res.redirect('/statistics');
     
  
      });
            
    });
         
/*router.post('/', (req, res) => {
  const newVote = new Statistics({
    Branch:req.body.branch,
    Placed:req.body.placed,
    max_ctc:req.body.max_ctc
  });
    newVote.save((err)=>{
            if(err)
            {
              console.log(err);
            }
            else
            {
            console.log(newVote);
              res.render('statistics');
            }
        });

});*/
  /*new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points: parseInt(vote.points),
      os: vote.os
    });

    return res.json({ success: true, message: 'Thank you for voting' });
  });
});*/

module.exports = router;