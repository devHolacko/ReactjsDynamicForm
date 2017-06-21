using System.Collections.Generic;
using LintsProject.Backend.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace LintsProject.Backend.Controllers
{
    [Route("api/[controller]")]
    public class ControlsController : Controller
    {
        private IHostingEnvironment _env;
        public ControlsController(IHostingEnvironment env)
        {
            _env = env;
        }
        // GET: api/values
        [HttpGet]
        public RootObject Get()
        {
            var webRoot = _env.ContentRootPath;
            var file = System.IO.Path.Combine(webRoot, @"Json\elements.json");
            //deserialize JSON from file  
            var json = System.IO.File.ReadAllText(file);
            var elements = JsonConvert.DeserializeObject<RootObject>(json);
            
            return elements;
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]RootObject jsonElements)
        {
            var jsonString = JsonConvert.SerializeObject(jsonElements);
            //var jsonObject = JsonConvert.DeserializeObject<RootObject>(jsonString);
            var webRoot = _env.ContentRootPath;
            var file = System.IO.Path.Combine(webRoot, @"Json\elements.json");
            System.IO.File.WriteAllText(file, jsonString);
        }
    }
}
