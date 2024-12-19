package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

// func init() {
// 	os.Setenv("PORT", "19565")
// 	os.Setenv("VIEWS_ROOT_PATH", "views/dist")
// 	os.Setenv("ASSETS_ROOT_PATH", "views")
// }

const (
	EnvViewsRootPath  = "VIEWS_ROOT_PATH"
	EnvAssetsRootPath = "ASSETS_ROOT_PATH"
)

func main() {
	e := gin.Default()
	templatesRootPath := path.Join(os.Getenv(EnvViewsRootPath))
	template, err := parseTemplate(templatesRootPath)
	if err != nil {
		panic(err)
	}
	e.SetHTMLTemplate(template)
	e = routes(e)
	e.Run(fmt.Sprintf("localhost:%s", os.Getenv("PORT")))
}

func routes(engine *gin.Engine) *gin.Engine {
	assetsRootPath := path.Join(os.Getenv(EnvAssetsRootPath))
	engine.StaticFile("/favicon.ico", assetsRootPath+"/public/favicon.ico")
	engine.Static("/static", assetsRootPath+"/public")
	engine.Static("/assets", assetsRootPath+"/dist/assets")
	engine.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "templates/index", nil)
	})
	engine.GET("/page/*path", func(c *gin.Context) {
		name := path.Join("templates", "pages", c.Param("path"))
		c.HTML(http.StatusOK, name, nil)
	})
	return engine
}

func parseTemplate(rootPath string) (*template.Template, error) {
	rootTemplate := template.New("")
	var parseTemplateFiles func(targetPath string) error
	parseTemplateFiles = func(targetPath string) error {
		files, err := os.ReadDir(path.Join(rootPath, targetPath))
		if err != nil {
			return fmt.Errorf("failed to read directory: %v", err)
		}
		for _, file := range files {
			if file.IsDir() {
				if err := parseTemplateFiles(path.Join(targetPath, file.Name())); err != nil {
					return err
				}
				continue
			}
			if strings.HasSuffix(file.Name(), ".html") {
				t, err := template.ParseFiles(path.Join(rootPath, targetPath, file.Name()))
				if err != nil {
					return err
				}
				for _, v := range t.Templates() {
					if strings.HasSuffix(file.Name(), ".html") {
						name := path.Join(targetPath, strings.TrimSuffix(file.Name(), ".html"))
						rootTemplate.AddParseTree(name, v.Tree)
						continue
					}
					rootTemplate.AddParseTree(path.Join(targetPath, v.Name()), v.Tree)
				}
			}
		}
		return nil
	}
	if err := parseTemplateFiles("partials"); err != nil {
		return nil, err
	}
	if err := parseTemplateFiles("templates"); err != nil {
		return nil, err
	}
	for _, v := range rootTemplate.Templates() {
		log.Print(v.Name())
	}
	return rootTemplate, nil
}
