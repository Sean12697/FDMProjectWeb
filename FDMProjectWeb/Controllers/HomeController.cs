using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FDMProjectWeb.Models;
using System.Web;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace FDMProjectWeb.Controllers
{
    public class HomeController : Controller
    {
        public readonly IHostingEnvironment hostingEnvironment;

        public HomeController(IHostingEnvironment he)
        {
            hostingEnvironment = he;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("Home")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            var uploads = Path.Combine(hostingEnvironment.WebRootPath, "uploads");
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Validation of CSV
                    var filePath = Path.Combine(uploads, file.FileName); // data.csv
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                }
            }
            return View("Index"); // Ok(new { files[0].FileName });
        }

        /*
        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";
            return View();
        }
        */
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
