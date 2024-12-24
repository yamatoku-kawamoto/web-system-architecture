package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/yargevad/filepathx"
)

var (
	// AssetRoot  = os.Getenv("ASSET_ROOT_PATH")
	AssetRoot      = "views/dist"
	TemplateRoot   = AssetRoot + "/src/templates"
	ComponentsRoot = AssetRoot + "/src/components"
)

func main() {
	fmt.Println(os.Getwd())
	engine := routes(gin.Default())
	templates := must(parseTemplates())
	engine.SetHTMLTemplate(templates)
	addr := fmt.Sprintf("localhost:%v", withDefault(os.Getenv("PORT"), 19565))
	engine.Run(addr)
}

func routes(engine *gin.Engine) *gin.Engine {
	engine.Static("/assets", path.Join(AssetRoot, "/assets"))
	engine.GET("/", func(c *gin.Context) {
		values := gin.H{
			"PageTitle": "Go Template | Vite + Solid + TS",
		}
		c.HTML(http.StatusOK, "index", values)
	})
	engine.GET("/page/*path", func(c *gin.Context) {
		name := strings.TrimSuffix(strings.TrimPrefix(c.Param("path"), "/"), ".html")
		c.HTML(http.StatusOK, name, nil)
	})
	staticFiles := func() func(c *gin.Context) {
		files := make(map[string]string)
		for _, file := range must(filepathx.Glob(path.Join(AssetRoot, "*.*"))) {
			name := filepath.Base(file)
			files[name] = filepath.ToSlash(file)
		}
		serveFile := func(c *gin.Context) {
			name := strings.TrimPrefix(c.Param("path"), "/")
			if _, ok := files[name]; !ok {
				c.Next()
				return
			}
			c.File(files[name])
			c.Abort()
		}
		return func(c *gin.Context) {
			switch c.Request.Method {
			case http.MethodGet, http.MethodHead:
				serveFile(c)
			default:
				c.Next()
			}
		}
	}
	notFound := func(c *gin.Context) {
		values := gin.H{
			"AccessURL": c.Request.RequestURI,
		}
		c.HTML(http.StatusNotFound, "404", values)
	}
	engine.NoRoute(staticFiles(), notFound)

	return engine
}

func parseTemplates() (*template.Template, error) {
	var rootTemplate *template.Template
	var parse func(rootPath, parentPath string) error
	parse = func(rootPath, parentPath string) error {
		basePath := path.Join(rootPath, parentPath)
		files, err := os.ReadDir(basePath)
		if err != nil {
			return err
		}
		for _, file := range files {
			if file.IsDir() {
				if err := parse(rootPath, path.Join(parentPath, file.Name())); err != nil {
					return err
				}
				continue
			}
			if !strings.HasSuffix(file.Name(), ".html") {
				continue
			}
			t, err := template.ParseFiles(path.Join(basePath, file.Name()))
			if err != nil {
				return err
			}
			name := path.Join(parentPath, strings.TrimSuffix(file.Name(), ".html"))
			for _, t := range t.Templates() {
				if strings.HasSuffix(t.Name(), ".html") {
					if rootTemplate == nil {
						rootTemplate = template.New(name)
					}
					rootTemplate.AddParseTree(name, t.Tree)
					continue
				}
				rootTemplate.AddParseTree(path.Join(name, t.Name()), t.Tree)
			}
		}
		return nil
	}
	if err := parse(TemplateRoot, ""); err != nil {
		return nil, err
	}
	if err := parse(ComponentsRoot, ""); err != nil {
		return nil, err
	}

	return rootTemplate, nil
}

func must[T any](v T, err error) T {
	if err != nil {
		log.Fatal(err)
	}
	return v
}

func withDefault[T any](v string, defaultValue T) T {
	switch any(defaultValue).(type) {
	case int, uint, int8, uint8, int16, uint16, int32, uint32, int64, uint64:
		if v == "" {
			return defaultValue
		}
		i := must(strconv.Atoi(v))
		return any(i).(T)
	}
	if v == "" {
		return defaultValue
	}
	return any(v).(T)
}
