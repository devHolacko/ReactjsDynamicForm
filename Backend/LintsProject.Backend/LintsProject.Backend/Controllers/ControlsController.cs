using System;
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

        [HttpGet]
        public RootObject Get()
        {
            var webRoot = _env.ContentRootPath;
            var file = System.IO.Path.Combine(webRoot, @"Json\elements.json");
            var json = System.IO.File.ReadAllText(file);
            var elements = JsonConvert.DeserializeObject<RootObject>(json);
            
            return elements;
        }

        [HttpPost]
        public void Post([FromBody]dynamic items)
        {
            var jsonString = JsonConvert.SerializeObject(items);
            var item = new ResultLog {CreatedOn = DateTime.Now, Data = jsonString};
            var webRoot = _env.ContentRootPath;
            var file = System.IO.Path.Combine(webRoot, @"Json\results.json");

            var json = System.IO.File.ReadAllText(file);
            

            List<ResultLog> lstExistingItems = string.IsNullOrEmpty(json)
                ? new List<ResultLog>()
                : (List<ResultLog>)JsonConvert.DeserializeObject(json, typeof(List<ResultLog>));

            lstExistingItems.Add(item);

            var lstJsonItems = JsonConvert.SerializeObject(lstExistingItems);

            System.IO.File.WriteAllText(file,lstJsonItems);
        }
    }
}
