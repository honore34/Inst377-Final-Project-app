const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.sendFile('public/home.html', { root: __dirname });
});


app.get('/CommunityPost', async (req, res) => {
  console.log('Attempting to get all Community posts!');

  const { data, error } = await supabase.from('CommunityPost')
  .select('*')
  .order('id',{ascending: true});

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    console.log('Recieved Data:', data);
    res.json(data);
  }

  console.log("data",data);
  console.log("error",error);

});

app.post('/CommunityPost', async (req, res) => {

  const username = req.body.username;
  const posted_comment = req.body.posted_comment;

  const { data, error } = await supabase
    .from('CommunityPost')
    .insert({ username, posted_comment })
    .select();

  if (error) {
    console.log(`Error: ${error}`);
    res.statusCode = 500;
    res.send(error);
  } else {
    res.json(data);
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});

app.put('/CommunityPost/:id/likes', async(req,res)=>{
    const id = req.params.id;

    const {data: currentPost,error: fetchError } = await supabase
    .from('CommunityPost')
    .select('likes')
    .eq('id',id)
    .single();
    if(fetchError){
        return res.status(500).json(fetchError);
    }

    const currentLike = currentPost.likes ;

    const{data, error}= await supabase
    .from('CommunityPost')
    .update({likes: currentLike +1})
    .eq('id',id)
    .select();

    res.json(data);
         
});

app.put('/CommunityPost/:id/dislikes', async(req,res)=>{
    const id = req.params.id;
    const {data: currentPost, error: fetchError} = await supabase
    .from('CommunityPost')
    .select('dislikes')
    .eq('id',id)
    .single();

    if(fetchError){
        return res.status(500).json(fetchError);
    }

    const currentDislike = currentPost.dislikes ;
    const{data, error}= await supabase
    .from('CommunityPost')
    .update({dislikes: currentDislike+1})
    .eq('id',id)
    .select();
    
    res.json(data);
        
    
});